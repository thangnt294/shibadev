import { Modal } from "antd";
import AddCommentForm from "../forms/AddCommentForm";
const CommentModal = ({
  visible,
  handleCloseModal,
  handleSubmit,
  savingComment,
  comment,
  setComment,
}) => {
  return (
    <Modal
      title="Add a comment"
      centered
      visible={visible}
      onCancel={handleCloseModal}
      confirmLoading={savingComment}
      onOk={handleSubmit}
    >
      <AddCommentForm
        setComment={setComment}
        comment={comment}
        savingComment={savingComment}
      />
    </Modal>
  );
};

export default CommentModal;
