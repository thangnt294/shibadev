import { Button, Progress, Tooltip, Form, Input } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { useEffect } from "react";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadBtnText,
  handleVideo,
  progress,
  handleRemoveVideo,
  savingLesson,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...values });
  }, [values]);

  return (
    <div className="container pt-3">
      <Form
        onSubmit={handleAddLesson}
        form={form}
        initialValues={{ ...values }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input lesson title" }]}
        >
          <Input
            type="text"
            className="form-control square"
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            value={values.title}
            placeholder="Title *"
            autoFocus
            required
          />
        </Form.Item>

        <Input.TextArea
          className="form-control"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        />

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadBtnText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>

          {!uploading && values && values.video && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleRemoveVideo} className="pt-1 ps-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && <Progress className="pt-2" percent={progress} />}
      </Form>
    </div>
  );
};

export default AddLessonForm;
