import { List, Avatar, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Item } = List;

const EditCourseLessonList = ({
  lessons,
  handleOpenEditLessonModal,
  handleDeleteLesson,
  handleDrag,
  handleDrop,
}) => {
  return (
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
            onClick={handleOpenEditLessonModal}
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
  );
};

export default EditCourseLessonList;
