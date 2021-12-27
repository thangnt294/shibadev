import { Modal } from "antd";
import EditLessonForm from "../forms/EditLessonForm";

const EditLessonModal = ({
  visible,
  lesson,
  setLesson,
  savingLesson,
  handleCloseModal,
  handleSubmit,
  uploadBtnText,
  uploading,
  handleVideo,
  handleRemoveVideo,
  progress,
  page,
}) => {
  return (
    <Modal
      title={page === "edit course" ? "Edit Lesson" : "Add Lesson"}
      centered
      visible={visible}
      onCancel={handleCloseModal}
      confirmLoading={uploading || savingLesson}
      onOk={handleSubmit}
    >
      <EditLessonForm
        lesson={lesson}
        setLesson={setLesson}
        handleSubmit={handleSubmit}
        handleVideo={handleVideo}
        handleRemoveVideo={handleRemoveVideo}
        uploadBtnText={uploadBtnText}
        uploading={uploading}
        progress={progress}
        savingLesson={savingLesson}
        page={page}
      />
    </Modal>
  );
};

export default EditLessonModal;
