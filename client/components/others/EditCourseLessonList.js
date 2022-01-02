import { List, Avatar, Popconfirm, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

const { Item } = List;

const EditCourseLessonList = ({
  lessons,
  handleOpenEditLessonModal,
  handleDeleteLesson,
  handleDrag,
  handleDrop,
}) => {
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
          onDragOver={(e) => e.preventDefault()}
          itemLayout="horizontal"
          dataSource={lessons}
          renderItem={(item, index) => (
            <Item
              className="pointer"
              draggable
              onDragStart={(e) => handleDrag(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Item.Meta
                onClick={() => handleOpenEditLessonModal(item)}
                avatar={
                  <Avatar style={{ backgroundColor: "#0388fc" }}>
                    {index + 1}
                  </Avatar>
                }
                title={item.title}
              ></Item.Meta>

              <Popconfirm
                title="Are you sure you want to delete this lesson?"
                onConfirm={() => handleDeleteLesson(index)}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="text-danger float-right" />
              </Popconfirm>
            </Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default EditCourseLessonList;
