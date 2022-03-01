import { Input } from "antd";

const AddCommentForm = ({ setComment, comment, savingComment }) => {
  return (
    <div className="container pt-3">
      <Input
        type="text"
        placeholder="Title *"
        className="form-control square"
        onChange={(e) => setComment({ ...comment, title: e.target.value })}
        value={comment?.title}
        autoFocus
        disabled={savingComment}
        required
      />

      <Input.TextArea
        className="form-control mt-3 mb-3"
        placeholder="Content *"
        cols="7"
        rows="7"
        onChange={(e) => setComment({ ...comment, content: e.target.value })}
        value={comment?.content}
        disabled={savingComment}
      />
    </div>
  );
};

export default AddCommentForm;
