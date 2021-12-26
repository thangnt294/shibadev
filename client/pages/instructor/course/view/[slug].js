import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { toast } from "react-toastify";
import { isEmpty } from "../../../../utils/helpers";
import InstructorCourseHeader from "../../../../components/others/InstructorCourseHeader";
import LessonList from "../../../../components/others/LessonList";
import EditLessonModal from "../../../../components/modal/EditLessonModal";

const CourseView = () => {
  const [course, setCourse] = useState(null);
  // for lessons
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    video: null,
  });
  const [savingLesson, setSavingLesson] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

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
    setLesson({ ...lesson, title: "", content: "", video: null });
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
      toast.error(err.response.data);
    }
  };

  const handleCloseModal = async () => {
    if (!isEmpty(lesson.video)) {
      // TODO remove video
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

              <EditLessonModal
                visible={visible}
                lesson={lesson}
                setLesson={setLesson}
                courseSlug={slug}
                savingLesson={savingLesson}
                courseId={course && course._id}
                instructorId={
                  course && course.instructor && course.instructor._id
                }
                handleCloseModal={handleCloseModal}
                handleSubmit={handleAddLesson}
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
        </div>
      </InstructorRoute>
    )
  );
};

export default CourseView;
