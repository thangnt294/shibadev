import { List, Avatar } from "antd";
import { useState, useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";
import { getChatRooms } from "../../../../server/controllers/chatroom";

const { Item } = List;

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    const { data } = await axios.get("/api/chat-rooms");
    setChatRooms(data);
  };

  return (
    <UserRoute>
      <List
        dataSource={["test", "test"]}
        renderItem={(item, index) => (
          <Link href={`/chat/${item._id}`}>
            <a>
              <Item>
                <Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      style={{ backgroundColor: "#ff5f6d" }}
                    >
                      {index + 1}
                    </Avatar>
                  }
                />
                {item.name}
              </Item>
            </a>
          </Link>
        )}
      />
    </UserRoute>
  );
};

export default Chat;
