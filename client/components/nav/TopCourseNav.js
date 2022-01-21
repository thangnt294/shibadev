import {
  InfoCircleOutlined,
  CommentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const TopCourseNav = ({ current, handleChangeTab }) => {
  return (
    <Menu
      onClick={handleChangeTab}
      selectedKeys={[current]}
      mode="horizontal"
      className="mb-3"
    >
      <Menu.Item key="about" icon={<InfoCircleOutlined />}>
        About
      </Menu.Item>
      <Menu.Item key="comments" icon={<CommentOutlined />}>
        Comments
      </Menu.Item>
      <Menu.Item key="instructor" icon={<UserOutlined />}>
        Instructor
      </Menu.Item>
    </Menu>
  );
};

export default TopCourseNav;
