import { List, Avatar } from "antd";
import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";
import { getUserId, truncateText } from "../../../utils/helpers";
import { Context } from "../../../global/Context";
import { io } from "socket.io-client";

const Messages = () => {
  const [chatRooms, setChatRooms] = useState([]);

  const { dispatch } = useContext(Context);

  const chatRoomRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    getChatRooms();
    return () => {
      chatRoomRef.current.forEach((chatRoom) => {
        console.log("LEAVING " + chatRoom._id);
        socketRef.current.emit("leave", { roomId: chatRoom._id });
      });
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
    console.log("SETUP A NEW SOCKET CONNECTION");
    const socket = io("http://localhost:8000");
    socketRef.current = socket;
    data.forEach((chatRoom) => {
      console.log("JOINING " + chatRoom._id);
      socket.emit("join", { roomId: chatRoom._id });
    });
    socket.on("new_message", (message) => {
      const cloneChatRooms = data.map((chatRoom) => {
        if (chatRoom._id.toString() === message.roomId.toString()) {
          chatRoom.messages = [...chatRoom.messages, message.message];
        }
        return chatRoom;
      });
      setChatRooms(cloneChatRooms);
    });
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">Messages</h1>
      <List
        dataSource={chatRooms}
        renderItem={(item) => {
          const target = item.users.find(
            (user) => user._id.toString() !== getUserId()
          );
          return (
            <Link href={`/user/messages/${item._id}`}>
              <a>
                <div className="d-flex border mt-3">
                  <Avatar
                    src={target.avatar ? target.avatar : "/avatar.png"}
                    size={100}
                  />
                  <div className="mt-3 ms-2">
                    <b>
                      <h4>{target.name}</h4>
                    </b>
                    <p className="lead" style={{ color: "gray" }}>
                      {item?.messages?.length > 0
                        ? truncateText(
                            item?.messages[item.messages?.length - 1]?.content,
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
    </UserRoute>
  );
};

export default Messages;
