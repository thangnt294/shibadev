import { useEffect } from "react";
import { Input, Progress, Switch, Form, Tooltip } from "antd";
import ReactPlayer from "react-player";
import { CloseCircleFilled } from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const EditLessonForm = ({
  lesson,
  setLesson,
  handleSubmit,
  progress,
  savingLesson,
  uploading,
  handleVideo,
  handleRemoveVideo,
  uploadBtnText,
  page,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...lesson });
  }, [lesson]);

  return (
    <div className="container pt-3">
      <Form onSubmit={handleSubmit} form={form} initialValues={{ ...lesson }}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input lesson title" }]}
        >
          <Input
            type="text"
            placeholder="Title *"
            className="form-control square"
            onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
            value={lesson.title}
            autoFocus
            disabled={uploading || savingLesson}
            required
          />
        </Form.Item>

        <Input.TextArea
          className="form-control mt-3 mb-3"
          placeholder="Content"
          cols="7"
          rows="7"
          onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
          value={lesson.content}
          disabled={uploading || savingLesson}
        />

        <div className="text-center">
          {!uploading && lesson.video && lesson.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              <ReactPlayer
                url={lesson.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}
          <div className="d-flex justify-content-center">
            <label className="btn btn-dark btn-block text-center mt-3">
              {truncateText(uploadBtnText, 20)}
              <input
                onChange={handleVideo}
                type="file"
                accept="video/*"
                hidden
                disabled={uploading || savingLesson}
              />
            </label>
            {!uploading && lesson && lesson.video && lesson.video.Location && (
              <Tooltip title="Remove">
                <span
                  onClick={handleRemoveVideo}
                  className="pt-1 ps-3"
                  disabled={uploading || savingLesson}
                >
                  <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {progress > 0 && <Progress className="pt-2" percent={progress} />}

        <div className="d-flex justify-content-between">
          <span className="pt-3 badge text-dark">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading || savingLesson}
            checked={lesson.preview}
            name="preview"
            onChange={(v) => setLesson({ ...lesson, preview: v })}
          />
        </div>
      </Form>
    </div>
  );
};

export default EditLessonForm;
