import { Modal } from "antd";
import { truncateText } from "../../utils/helpers";
import ReactMarkdown from "react-markdown";

const ViewLessonModal = ({ lesson, visible, handleCloseModal }) => {
  return (
    <Modal
      title={lesson && lesson.title && truncateText(lesson.title, 60)}
      centered
      visible={visible}
      onCancel={handleCloseModal}
      footer={null}
    >
      {lesson && lesson.video && lesson.video.Location && (
        <div className="pt-2 d-flex justify-content-center">
          <ReactPlayer
            url={lesson.video.Location}
            width="410px"
            height="240px"
            controls
          />
        </div>
      )}
      <ReactMarkdown>{lesson && lesson.content}</ReactMarkdown>
    </Modal>
  );
};

export default ViewLessonModal;
