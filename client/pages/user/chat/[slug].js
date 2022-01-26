import { useRouter } from "next/router";
import io from "socket.io-client";

const ChatRoomPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const socket = io("localhost:8000", {
      query: {
        token: localStorage.getItem("token"),
      },
    });

    socket.emit("join", ({ error }) => {
      alert("Error");
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, []);

  return <h1>Chat room page</h1>;
};

export default ChatRoomPage;
