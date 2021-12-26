import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Modal } from "antd";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import { isEmpty } from "../../../../utils/helpers";
import InstructorCourseHeader from "../../../../components/others/InstructorCourseHeader";
import LessonList from "../../../../components/others/LessonList";
import ViewLessonModal from "../../../../components/modal/ViewLessonModal";

const CourseView = () => {
  const [course, setCourse] = useState(null);
  // for lessons
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: null,
  });
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [savingLesson, setSavingLesson] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [viewLessonVisible, setViewLessonVisible] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && countStudent();
  }, [course]);

  const countStudent = async () => {
    const { data } = await axios.get(
      `/api/instructor/student-count/${course._id}`
    );

    setStudentCount(data);
  };

  const loadCourse = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
    setLoading(false);
  };

  const clearState = () => {
    setVisible(false);
    setValues({ ...values, title: "", content: "", video: null });
    setProgress(0);
    setSavingLesson(false);
    setUploadBtnText("Upload Video");
  };

  const handleOpenAddLessonModal = () => {
    if (course.published) return;
    setVisible(true);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (isEmpty(values.title)) {
      toast.error("Please fill in all the required fields before saving");
      return;
    }
    if (isEmpty(values.content) && isEmpty(values.video)) {
      toast.error("Please add some content or upload a video");
      return;
    }
    try {
      setSavingLesson(true);
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      clearState();
      setCourse(data);
      toast.success("New lesson added");
    } catch (err) {
      clearState();
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleVideo = async (e) => {
    if (course.published) return;
    try {
      const file = e.target.files[0];
      setUploadBtnText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      setValues({ ...values, video: data });
      setUploading(false);
      toast.success("Uploaded video successfully");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error(err.response.data);
    }
  };

  const handleRemoveVideo = async () => {
    if (course.published) return;
    try {
      setUploading(true);
      await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      setValues({ ...values, video: null });
      setUploading(false);
      setUploadBtnText("Upload Video");
      setProgress(0);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error(err.response.data);
    }
  };

  const handleCloseModal = async () => {
    if (!isEmpty(values.video)) await handleRemoveVideo();
    clearState();
  };

  const handlePublish = async (courseId) => {
    try {
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast.success(
        "Congratulations! Your course is now live on the marketplace"
      );
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleUnpublish = async (courseId) => {
    try {
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.success("Your course is unpublished");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleRouteToEditCourse = () => {
    if (course.published) return;
    router.push(`/instructor/course/edit/${slug}`);
  };

  const handleViewLesson = (lesson) => {
    setCurrentLesson(lesson);
    setViewLessonVisible(true);
  };

  const handleCloseViewLesson = () => {
    setCurrentLesson(null);
    setViewLessonVisible(false);
  };

  return (
    !loading && (
      <InstructorRoute>
        <div className="container-fluid pt-3">
          {course && (
            <div className="container-fluid pt-1">
              <InstructorCourseHeader
                course={course}
                studentCount={studentCount}
                handlePublish={handlePublish}
                handleUnpublish={handleUnpublish}
                setVisible={setVisible}
                handleRouteToEditCourse={handleRouteToEditCourse}
                handleOpenAddLessonModal={handleOpenAddLessonModal}
              />

              <Modal
                title="Add a new lesson"
                centered
                visible={visible}
                onCancel={handleCloseModal}
                footer={null}
              >
                <AddLessonForm
                  values={values}
                  setValues={setValues}
                  handleAddLesson={handleAddLesson}
                  uploading={uploading}
                  uploadBtnText={uploadBtnText}
                  handleVideo={handleVideo}
                  progress={progress}
                  handleRemoveVideo={handleRemoveVideo}
                  savingLesson={savingLesson}
                />
              </Modal>
              <hr />
              <div className="row pb-5 mt-4">
                <div className="col lesson-list">
                  <h4>
                    {course && course.lessons && course.lessons.length} Lessons
                  </h4>
                  <LessonList
                    lessons={course.lessons}
                    handleViewLesson={handleViewLesson}
                  />
                  <ViewLessonModal
                    lesson={currentLesson}
                    visible={viewLessonVisible}
                    handleCloseModal={handleCloseViewLesson}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </InstructorRoute>
    )
  );
};

export default CourseView;
