import { useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import EditLessonForm from "../forms/EditLessonForm";

const EditLessonModal = ({
  visible,
  lesson,
  setLesson,
  courseSlug,
  savingLesson,
  courseId,
  instructorId,
  handleCloseModal,
  handleSubmit,
}) => {
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  console.log("LESSON", lesson);

  const handleVideo = async (e) => {
    if (e.target.files.length === 0) return;
    try {
      // remove previous video
      if (lesson.video && lesson.video.Location) {
        await axios.post(
          `/api/course/video-remove/${instructorId}`,
          lesson.video
        );
      }

      // upload new one
      const file = e.target.files[0];
      setUploadBtnText(file.name);
      setUploading(true);

      // send video as form data
      const videoData = new FormData();
      videoData.append("video", file);
      videoData.append("courseId", courseId);

      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${instructorId}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      setLesson({ ...lesson, video: data });

      // update lesson since video changed
      await axios.put(`/api/course/lesson/${courseSlug}/${lesson._id}`, lesson);
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error(err.response.data);
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setUploading(true);
      await axios.post(
        `/api/course/video-remove/${instructorId}`,
        lesson.video
      );
      setLesson({ ...lesson, video: null });
      if (courseSlug) {
        await axios.put(
          `/api/course/lesson/${courseSlug}/${lesson._id}`,
          lesson
        );
      }
      setUploading(false);
      setUploadBtnText("Upload Video");
      setProgress(0);
    } catch (err) {
      console.log(err);
      setUploading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  return (
    <Modal
      title="Update lesson"
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
        setUploading={setUploading}
        savingLesson={savingLesson}
      />
    </Modal>
  );
};

export default EditLessonModal;
