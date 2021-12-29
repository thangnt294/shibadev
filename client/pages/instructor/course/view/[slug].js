import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { toast } from "react-toastify";
import { isEmpty } from "../../../../utils/helpers";
import InstructorCourseHeader from "../../../../components/others/InstructorCourseHeader";
import LessonList from "../../../../components/others/LessonList";
import EditLessonModal from "../../../../components/modal/EditLessonModal";
import Loading from "../../../../components/others/Loading";
import ReactMarkdown from "react-markdown";

const CourseView = () => {
  const [course, setCourse] = useState(null);
  // for lessons
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    video: null,
    preview: false,
  });
  const [savingLesson, setSavingLesson] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");

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
    setLesson({
      ...lesson,
      title: "",
      content: "",
      video: null,
      preview: false,
    });
    setUploadBtnText("Upload Video");
    setProgress(0);
    setSavingLesson(false);
  };

  const handleOpenAddLessonModal = () => {
    if (course.published) return;
    setVisible(true);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (isEmpty(lesson.title)) {
      toast.error("Please fill in all the required fields before saving");
      return;
    }
    if (isEmpty(lesson.content) && isEmpty(lesson.video)) {
      toast.error("Please add some content or upload a video");
      return;
    }
    setSavingLesson(true);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        lesson
      );
      clearState();
      setCourse(data);
      toast.success("New lesson added");
    } catch (err) {
      clearState();
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleVideo = async (e) => {
    if (e.target.files.length === 0) return;
    try {
      // remove previous video
      if (lesson.video && lesson.video.Location) {
        await axios.post(
          `/api/course/video-remove/${course.instructor._id}`,
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
      videoData.append("courseId", course._id);

      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      setLesson({ ...lesson, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setUploading(true);
      await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        lesson.video
      );
      setLesson({ ...lesson, video: null });
      setUploading(false);
      setUploadBtnText("Upload Video");
      setProgress(0);
    } catch (err) {
      console.log(err);
      setUploading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleCloseModal = async () => {
    if (!isEmpty(lesson.video)) {
      await handleRemoveVideo();
    }
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
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleUnpublish = async (courseId) => {
    try {
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.success("Your course is unpublished");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleRouteToEditCourse = () => {
    if (course.published) return;
    router.push(`/instructor/course/edit/${slug}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <InstructorRoute>
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
          <ReactMarkdown className="mt-4">{course.description}</ReactMarkdown>

          <EditLessonModal
            visible={visible}
            lesson={lesson}
            setLesson={setLesson}
            savingLesson={savingLesson}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleAddLesson}
            handleVideo={handleVideo}
            handleRemoveVideo={handleRemoveVideo}
            uploading={uploading}
            progress={progress}
            uploadBtnText={uploadBtnText}
          />
          <hr />
          <div className="row pb-5 mt-4">
            <div className="col lesson-list">
              <h4>
                {course && course.lessons && course.lessons.length} Lessons
              </h4>
              <LessonList lessons={course.lessons} checkPreview={false} />
            </div>
          </div>
        </div>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
