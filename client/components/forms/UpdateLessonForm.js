import { Button, Input, Progress, Switch, Form } from "antd";
import { useEffect } from "react";
import ReactPlayer from "react-player";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoBtnText,
  handleVideo,
  progress,
  savingLesson,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...current });
  }, [current]);
  return (
    <div className="container pt-3">
      <Form
        onSubmit={handleUpdateLesson}
        form={form}
        initialValues={{ ...current }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input lesson title" }]}
        >
          <Input
            type="text"
            className="form-control square"
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            value={current.title}
            autoFocus
            required
          />
        </Form.Item>

        <Input.TextArea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        />

        <div className="text-center">
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}
          <label className="btn btn-dark btn-block text-center mt-3">
            {uploadVideoBtnText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <div className="d-flex justify-content-between">
          <span className="pt-3 badge text-dark">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            checked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading || savingLesson}
          shape="round"
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

export default UpdateLessonForm;
