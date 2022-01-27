import { Menu, Avatar } from "antd";
import { truncateText } from "../../utils/helpers";
import { getUserId } from "../../utils/helpers";

const { Item } = Menu;

const ChatNav = ({ chatRooms, clicked, setClicked }) => {
  return (
    <Menu selectedKeys={[clicked]} className="mt-3">
      {chatRooms.map((chatRoom) => {
        const target = chatRoom.users.find(
          (user) => user._id.toString() !== getUserId()
        );
        return (
          <Item
            key={chatRoom._id}
            onClick={() => setClicked(chatRoom._id.toString())}
            icon={
              <Avatar src={target.avatar ? target.avatar : "/avatar.png"} />
            }
          >
            {truncateText(target.name, 30)}{" "}
          </Item>
        );
      })}
    </Menu>
  );
};

export default ChatNav;
