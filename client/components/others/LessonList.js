import { List, Avatar } from "antd";
import { truncateText } from "../../utils/helpers";

const { Item } = List;

const LessonList = ({ lessons, handleViewLesson }) => {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={lessons}
      renderItem={(item, index) => (
        <Item className="border pointer" onClick={() => handleViewLesson(item)}>
          <div className="d-flex">
            <Avatar
              shape="square"
              size={70}
              style={{ backgroundColor: "#03a1fc" }}
            >
              {index + 1}
            </Avatar>
            <div className="ms-3">
              <h6 className="lead">
                <b>{truncateText(item.title, 60)}</b>
              </h6>
              <p>{truncateText(item.content, 200)}</p>
            </div>
          </div>
        </Item>
      )}
    />
  );
};

export default LessonList;
