import { Form, Input } from "antd";

const AddCommentForm = ({
  handleSubmit,
  setComment,
  comment,
  savingComment,
}) => {
  const [form] = Form.useForm();

  return (
    <div className="container pt-3">
      <Form onSubmit={handleSubmit} form={form}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input comment title" }]}
        >
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
        </Form.Item>

        <Form.Item
          name="content"
          rules={[{ required: true, message: "Please input content" }]}
        >
          <Input.TextArea
            className="form-control mt-3 mb-3"
            placeholder="Content *"
            cols="7"
            rows="7"
            onChange={(e) => setComment({ ...comment, title: e.target.value })}
            value={comment?.content}
            disabled={savingComment}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCommentForm;
