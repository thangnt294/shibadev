import { Menu, Avatar } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const { Item } = Menu;

const CourseNav = ({ course, clicked, setClicked, completedLessons }) => {
  return (
    <Menu defaultSelectedKeys={[clicked]} className="mt-3">
      {course.lessons.map((lesson, index) => (
        <Item
          key={lesson._id}
          onClick={() => setClicked(index)}
          icon={
            <Avatar style={{ backgroundColor: "#fcba03" }}>{index + 1}</Avatar>
          }
        >
          {truncateText(lesson.title, 30)}{" "}
          {completedLessons.includes(lesson._id) && (
            <CheckCircleFilled className="float-right text-success ms-2" />
          )}
        </Item>
      ))}
    </Menu>
  );
};

export default CourseNav;
