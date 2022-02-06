import { List, Avatar } from "antd";
import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";
import { getUserId, truncateText } from "../../../utils/helpers";
import { Context } from "../../../global/Context";
import { io } from "socket.io-client";
import { MessageOutlined } from "@ant-design/icons";

const Messages = () => {
  const [chatRooms, setChatRooms] = useState([]);

  const { dispatch } = useContext(Context);

  const chatRoomRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    getChatRooms();
    return () => {
      chatRoomRef.current?.forEach((chatRoom) => {
        console.log("LEAVING " + chatRoom._id);
        socketRef.current.emit("leave", { roomId: chatRoom._id });
      });
      socketRef.current.emit("user_leave", { userId: getUserId() });
      chatRoomRef.current = null;
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, []);

  const getChatRooms = async () => {
    dispatch({ type: "LOADING", payload: true });
    const userId = getUserId();
    const { data } = await axios.get(`/api/user/${userId}/chat-rooms`);
    setChatRooms(data);
    dispatch({ type: "LOADING", payload: false });
    chatRoomRef.current = chatRooms;

    // setup socket
    console.log("SETUP A NEW SOCKET CONNECTION!");
    const dev = process.env.NEXT_PUBLIC_SOCKET === "development";
    const socket = dev ? io("http://localhost:8000") : io();
    socketRef.current = socket;
    data.forEach((chatRoom) => {
      console.log("JOINING " + chatRoom._id);
      socket.emit("join", { roomId: chatRoom._id });
    });
    socket.emit("user_listen", { userId });
    socket.on("new_message", (message) => {
      const cloneChatRooms = data.map((chatRoom) => {
        if (chatRoom._id.toString() === message.roomId.toString()) {
          chatRoom.messages = [...chatRoom.messages, message.message];
        }
        return chatRoom;
      });
      setChatRooms(cloneChatRooms);
    });
    socket.on("new_chat_room", ({ chatRoom }) => {
      setChatRooms((chatRooms) => [chatRoom, ...chatRooms]);
      data.unshift(chatRoom);
      socketRef.current?.emit("join", { roomId: chatRoom._id });
    });
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">Messages</h1>
      {chatRooms?.length > 0 ? (
        <List
          dataSource={chatRooms}
          className="mb-3"
          renderItem={(item) => {
            const target = item?.users?.find(
              (user) => user?._id?.toString() !== getUserId()
            );
            return (
              <Link href={`/user/messages/${item._id}`}>
                <a>
                  <div className="d-flex border mt-3">
                    <Avatar
                      src={target?.avatar ? target?.avatar : "/avatar.png"}
                      size={80}
                    />
                    <div className="mt-3 ms-2">
                      <b>
                        <h5>{target.name}</h5>
                      </b>
                      <p style={{ color: "gray" }}>
                        {item?.messages?.length > 0
                          ? truncateText(
                              item?.messages[item.messages?.length - 1]
                                ?.content,
                              30
                            )
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            );
          }}
        />
      ) : (
        <div className="d-flex justify-content-center p-5">
          <div className="text-center p-5">
            <MessageOutlined className="text-muted display-1 p-4" />
            <p className="lead">
              You have no messages. Enroll in a course to send messages to your
              instructor.
            </p>
          </div>
        </div>
      )}
    </UserRoute>
  );
};

export default Messages;
