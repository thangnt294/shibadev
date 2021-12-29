import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { truncateText } from "../../utils/helpers";

const CourseContent = ({
  course,
  clicked,
  markCompleted,
  markIncomplete,
  completedLessons,
}) => {
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

      {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
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
      <ReactMarkdown className="single-post mt-3 ms-3">
        {course.lessons[clicked].content}
      </ReactMarkdown>
    </div>
  );
};

export default CourseContent;
