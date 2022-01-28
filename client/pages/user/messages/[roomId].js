import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import axios from "axios";
import { getUserId } from "../../../utils/helpers";
import ChatNav from "../../../components/nav/ChatNav";
import ChatBody from "../../../components/others/ChatBody";
import Loading from "../../../components/others/Loading";

const MessagePage = () => {
  const [clicked, setClicked] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { roomId } = router.query;
  const socketRef = useRef();

  const getChatRooms = async () => {
    const userId = getUserId();
    const { data } = await axios.get(`/api/user/${userId}/chat-rooms`);
    setChatRooms(data);
  };

  const getChatRoom = async () => {
    if (roomId) {
      const { data } = await axios.get(`/api/chat-room?roomId=${roomId}`);
      if (data) {
        const target = data.users.find(
          (user) => user._id.toString() !== getUserId()
        );
        setMessages(data.messages);
        setTarget(target);
        setClicked(data._id.toString());
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getChatRooms();
    getChatRoom();
    setLoading(false);

    const socket = io("http://localhost:8000");
    socketRef.current = socket;
    socket.emit("join", { roomId });
    socket.on("new_message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
    return () => {
      socket.emit("leave", { roomId });
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (socketRef.current) {
      const userId = getUserId();
      socketRef.current.emit("message", { roomId, userId, message });
      setMessage("");
    }
  };

  const handleChangeTab = (roomId) => {
    router.push(`/user/messages/${roomId}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <ChatNav
            clicked={clicked}
            handleChangeTab={handleChangeTab}
            chatRooms={chatRooms}
          />
        </div>
        <div className="col-md-10">
          {loading ? (
            <Loading />
          ) : (
            <ChatBody
              target={target}
              messages={messages}
              setMessage={setMessage}
              sendMessage={sendMessage}
              message={message}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
