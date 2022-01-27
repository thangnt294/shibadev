import { List, Avatar } from "antd";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";
import { getUserId, truncateText } from "../../../utils/helpers";
import { Context } from "../../../global/Context";

const { Item } = List;

const Messages = () => {
  const [chatRooms, setChatRooms] = useState([]);

  const { dispatch } = useContext(Context);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    dispatch({ type: "LOADING", payload: true });
    const userId = getUserId();
    const { data } = await axios.get(`/api/user/${userId}/chat-rooms`);
    setChatRooms(data);
    dispatch({ type: "LOADING", payload: false });
  };

  return (
    <UserRoute>
      <List
        dataSource={chatRooms}
        renderItem={(item, index) => {
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
                      {item.messages.length > 0 &&
                        truncateText(
                          item.messages[item.messages.length - 1].content,
                          30
                        )}
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
