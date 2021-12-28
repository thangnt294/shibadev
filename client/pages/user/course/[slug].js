import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { CodeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { isEmpty } from "../../../utils/helpers";
import CourseNav from "../../../components/nav/CourseNav";
import Loading from "../../../components/others/Loading";
import CourseContent from "../../../components/others/CourseContent";

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  // force state update
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (!isEmpty(course._id)) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.get(`/api/list-completed/${course._id}`);
    setCompletedLessons(data);
    setLoading(false);
  };

  const markCompleted = async () => {
    try {
      await axios.post("/api/mark-completed", {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
      toast.success("Mark as completed successfully");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  const markIncomplete = async () => {
    try {
      await axios.post("/api/mark-incomplete", {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      const all = completedLessons;
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
      toast.success("Mark as incomplete successfully");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  return (
    <StudentRoute>
      {loading ? (
        <Loading />
      ) : (
        <div className="row">
          <CourseNav
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            course={course}
            clicked={clicked}
            setClicked={setClicked}
            completedLessons={completedLessons}
          />
          <div className="col">
            {clicked !== -1 ? (
              <CourseContent
                course={course}
                clicked={clicked}
                markCompleted={markCompleted}
                markIncomplete={markIncomplete}
                completedLessons={completedLessons}
              />
            ) : (
              <div className="d-flex justify-content-center p-5">
                <div className=" text-center p-5">
                  <img src="/waving-white.jpg" className="p-3" />
                  <h2 className="font-weight-bold">
                    Welcome! We're excited to have you here!
                  </h2>
                  <p className="lead">
                    Thank you for enrolling into this course. We hope that you
                    will have a great time studying.
                  </p>
                  <p className="lead">
                    Click on the lessons to start learning right away!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </StudentRoute>
  );
};

export default SingleCourse;
