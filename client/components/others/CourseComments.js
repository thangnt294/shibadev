import { useState } from "react";
import { Avatar, List, Pagination, Button } from "antd";
import CommentModal from "../modal/CommentModal";

const CourseComments = () => {
  const [comment, setComment] = useState(null);
  const [visible, setVisible] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const mockList = [
    {
      title: "Hi",
      content: "Content",
      commenter: {
        avatar: "/avatar.png",
        name: "Thomas",
      },
    },
    {
      title: "Hello",
      content: "Content hello",
      commenter: {
        avatar: "/avatar.png",
        name: "Thomas",
      },
    },
  ];

  const handleCloseModal = () => {
    setComment(null);
    setVisible(false);
  };

  const handleSubmit = () => {
    console.log("SUBMIT");
  };
  return (
    <>
      <CommentModal
        visible={visible}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        savingComment={savingComment}
        comment={comment}
        setComment={setComment}
      />
      <Button onClick={() => setVisible(true)}>Add a comment</Button>
      <List
        dataSource={mockList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar src={item.commenter.avatar} />}
              title={item.title}
              description={`By ${item.commenter.name} on 23/02/2021`}
            />
            {item.content}
          </List.Item>
        )}
      />
      <div className="text-center">
        <Pagination
        // defaultCurrent={1}
        // current={page + 1}
        // pageSize={limit}
        // onChange={handleSearchCourses}
        // total={total === null ? initialTotal : total}
        />
      </div>
    </>
  );
};

export default CourseComments;
