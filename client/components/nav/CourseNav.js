import { Menu, Avatar, Button } from "antd";
import {
  CheckCircleFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const { Item } = Menu;

const CourseNav = ({
  collapsed,
  setCollapsed,
  course,
  clicked,
  setClicked,
  completedLessons,
}) => {
  return (
    <div>
      <Button
        type="primary"
        onClick={() => setCollapsed(!collapsed)}
        className="mb-2 mt-2"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu defaultSelectedKeys={[clicked]} inlineCollapsed={collapsed}>
        {course.lessons.map((lesson, index) => (
          <Item
            key={lesson._id}
            onClick={() => setClicked(index)}
            icon={
              <Avatar style={{ backgroundColor: "#fcba03" }}>
                {index + 1}
              </Avatar>
            }
          >
            {truncateText(lesson.title, 30)}{" "}
            {completedLessons.includes(lesson._id) && (
              <CheckCircleFilled className="float-right text-success ms-2" />
            )}
          </Item>
        ))}
      </Menu>
    </div>
  );
};

export default CourseNav;
