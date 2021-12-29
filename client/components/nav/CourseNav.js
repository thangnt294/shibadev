import { Menu, Avatar, Layout } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const { Sider } = Layout;
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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        style={{ minHeight: "100vh" }}
      >
        <Menu defaultSelectedKeys={[clicked]} theme="dark" mode="inline">
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
      </Sider>
    </div>
  );
};

export default CourseNav;
