import { useState, useEffect } from "react";
import { Avatar, List, Pagination, Button } from "antd";
import CommentModal from "../modal/CommentModal";
import { toast } from "react-toastify";
import moment from "moment";

const CourseComments = ({ comments, handleAddComment }) => {
  const [comment, setComment] = useState(null);
  const [visible, setVisible] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [page, setPage] = useState(0);
  const [currentComments, setCurrentComments] = useState([]);

  useEffect(() => {
    setCurrentComments(comments.slice((page - 1) * 6, page * 6));
  }, [page]);

  const handleCloseModal = () => {
    setComment(null);
    setSavingComment(false);
    setVisible(false);
  };

  const handleSubmit = async () => {
    setSavingComment(true);
    try {
      await handleAddComment(comment);
      handleCloseModal();
    } catch (err) {
      console.log(err);
      handleCloseModal();
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleChangePage = (page) => {
    setPage(page);
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
      <List
        dataSource={currentComments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.commenter.avatar
                      ? item.commenter.avatar
                      : "/avatar.png"
                  }
                />
              }
              title={<b>{item.title}</b>}
              description={
                <i>{`by ${item.commenter.name} on ${moment(
                  item.createdAt
                ).format("DD/MM/YYYY")}`}</i>
              }
            />
            <br />
            {item.content}
          </List.Item>
        )}
      />
      <br />
      <Button onClick={() => setVisible(true)} className="mb-3">
        Add a comment
      </Button>
      <div className="text-center">
        <Pagination
          defaultCurrent={1}
          current={page}
          pageSize={6}
          onChange={handleChangePage}
          total={comments.length}
        />
      </div>
    </>
  );
};

export default CourseComments;
