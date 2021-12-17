import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  CodeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Item } = Menu;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  // force state update
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.get(`/api/list-completed/${course._id}`);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    try {
      const { data } = await axios.post("/api/mark-completed", {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
      toast.success("Mark as completed successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const markIncomplete = async () => {
    try {
      const { data } = await axios.post("/api/mark-incomplete", {
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
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 btn-block mb-2"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
            {!collapsed && "Lessons"}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: "80vh", overflow: "scroll" }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                key={lesson._id}
                onClick={() => setClicked(index)}
                icon={
                  <Avatar style={{ backgroundColor: "#fcba03" }}>
                    {index + 1}
                  </Avatar>
                }
              >
                {lesson.title.substring(0, 30)}{" "}
                {completedLessons.includes(lesson._id) && (
                  <CheckCircleFilled className="float-right text-success ms-2" />
                )}
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary square">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>

                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span className="float-end pointer" onClick={markIncomplete}>
                    Mark as incomplete
                  </span>
                ) : (
                  <span className="float-end pointer" onClick={markCompleted}>
                    Mark as completed
                  </span>
                )}
              </div>

              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <div className="wrapper">
                    <ReactPlayer
                      className="player"
                      url={course.lessons[clicked].video.Location}
                      width="80vw"
                      height="80vh"
                      controls
                      onEnded={markCompleted}
                    />
                  </div>
                )}
              <ReactMarkdown className="single-post mt-3">
                {course.lessons[clicked].content}
              </ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className=" text-center p-5">
                <CodeOutlined className="text-primary display-1 p-5" />
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
    </StudentRoute>
  );
};

export default SingleCourse;
