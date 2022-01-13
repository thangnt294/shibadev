import { useState } from "react";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { truncateText } from "../../utils/helpers";
import InfiniteScroll from "react-infinite-scroll-component";
import TopCourseNav from "../nav/TopCourseNav";
import CourseAbout from "./CourseAbout";
import CourseComments from "./CourseComments";

const CourseContent = ({
  course,
  clicked,
  markCompleted,
  markIncomplete,
  completedLessons,
  handleAddComment,
  handleRateCourse,
}) => {
  const [current, setCurrent] = useState("about");

  const handleChangeTab = (e) => {
    setCurrent(e.key);
  };

  const renderSwitch = () => {
    switch (current) {
      case "about":
        return (
          <CourseAbout course={course} handleRateCourse={handleRateCourse} />
        );
      case "comments":
        return (
          <CourseComments
            handleAddComment={handleAddComment}
            comments={course.comments}
          />
        );
      default:
        return (
          <CourseAbout course={course} handleRateCourse={handleRateCourse} />
        );
    }
  };

  return (
    <div className="p-3">
      <div className="alert alert-primary square">
        <b>{truncateText(course.lessons[clicked].title, 100)}</b>

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
      <div id="scrollableDiv" style={{ height: "60vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={1}
          hasMore={false}
          scrollableTarget="scrollableDiv"
        >
          {course.lessons[clicked].video &&
            course.lessons[clicked].video.Location && (
              <div className="wrapper">
                <ReactPlayer
                  className="player"
                  url={course.lessons[clicked].video.Location}
                  width="100%"
                  height="60vh"
                  controls
                  onEnded={markCompleted}
                />
              </div>
            )}
          <ReactMarkdown className="single-post mt-3 ms-3">
            {course.lessons[clicked].content}
          </ReactMarkdown>
        </InfiniteScroll>
      </div>
      <hr />
      <TopCourseNav handleChangeTab={handleChangeTab} current={current} />
      {renderSwitch()}
    </div>
  );
};

export default CourseContent;
