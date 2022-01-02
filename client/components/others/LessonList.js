import { useState } from "react";
import { List, Avatar, Divider } from "antd";
import { truncateText } from "../../utils/helpers";
import { PlayCircleOutlined } from "@ant-design/icons";
import ViewLessonModal from "../modal/ViewLessonModal";
import InfiniteScroll from "react-infinite-scroll-component";

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
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: "auto",
        padding: "0 16px",
      }}
    >
      <InfiniteScroll
        dataLength={lessons.length}
        endMessage={<Divider plain>That's all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={lessons}
          renderItem={(item, index) => (
            <Item className="pointer" onClick={() => handleViewLesson(item)}>
              <Item.Meta
                avatar={
                  <Avatar shape="square" style={{ backgroundColor: "#ff5f6d" }}>
                    {index + 1}
                  </Avatar>
                }
                title={<b>{truncateText(item.title, 60)}</b>}
                description={<p>{truncateText(item.content, 200)}</p>}
              />
              {item.preview && (
                <PlayCircleOutlined className="text-warning h3 me-2" />
              )}
            </Item>
          )}
        />
        <ViewLessonModal
          lesson={currentLesson}
          visible={viewLessonVisible}
          handleCloseModal={handleCloseViewLesson}
        />
      </InfiniteScroll>
    </div>
  );
};

export default LessonList;
