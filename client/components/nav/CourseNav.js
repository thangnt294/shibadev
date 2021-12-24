import { createElement } from "react";
import { Button, Menu, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

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
    <div style={{ maxWidth: 320 }}>
      <Button
        onClick={() => setCollapsed(!collapsed)}
        className="text-primary mt-1 btn-block mb-2"
      >
        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
        {!collapsed && "Lessons"}
      </Button>
      <Menu
        defaultSelectedKeys={[clicked]}
        inlineCollapsed={collapsed}
        style={{ height: "80vh", overflow: "scroll" }}
      >
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
            {lesson.title.substring(0, 30)}{" "}
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
