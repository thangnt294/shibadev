import { useState } from "react";
import { List, Avatar } from "antd";
import { truncateText } from "../../utils/helpers";
import { PlayCircleOutlined } from "@ant-design/icons";
import ViewLessonModal from "../modal/ViewLessonModal";

const { Item } = List;

const LessonList = ({ lessons, checkPreview }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [viewLessonVisible, setViewLessonVisible] = useState(false);

  const handleViewLesson = (lesson) => {
    if (checkPreview && !lesson.preview) return;
    setCurrentLesson(lesson);
    setViewLessonVisible(true);
  };

  const handleCloseViewLesson = () => {
    setCurrentLesson(null);
    setViewLessonVisible(false);
  };

  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={lessons}
        renderItem={(item, index) => (
          <Item
            className="border pointer"
            onClick={() => handleViewLesson(item)}
          >
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <Avatar
                  shape="square"
                  size={80}
                  style={{ backgroundColor: "#ff9900" }}
                >
                  {index + 1}
                </Avatar>
                <div className="ms-3">
                  <h6 className="lead mt-2">
                    <b>{truncateText(item.title, 60)}</b>
                  </h6>
                  <p>{truncateText(item.content, 200)}</p>
                </div>
              </div>
              {item.preview && (
                <PlayCircleOutlined className="text-warning h3 align-self-center me-3" />
              )}
            </div>
          </Item>
        )}
      />
      <ViewLessonModal
        lesson={currentLesson}
        visible={viewLessonVisible}
        handleCloseModal={handleCloseViewLesson}
      />
    </>
  );
};

export default LessonList;
