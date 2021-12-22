import { currencyFormatter } from "../../utils/helpers";
import { Badge, Button } from "antd";
import ReactPlayer from "react-player";
import {
  LoadingOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const SingleCourseJumbotron = ({
  course,
  setShowModal,
  setPreview,
  user,
  loading,
  handleEnrollment,
  status,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    tags,
  } = course;
  return (
    <div className="jumbotron bg-primary square">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">{name}</h1>
          <p className="lead">
            {description && description.length > 200
              ? description.substring(0, 200) + "..."
              : description}
          </p>
          {tags &&
            tags.map((tag) => (
              <Badge
                count={tag}
                style={{ backgroundColor: "#03a9f4" }}
                className="pb-4 me-2"
                key={tag}
              />
            ))}

          <p>Created by {instructor.name}</p>
          <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({ amount: price, currency: "usd" })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(true);
              }}
            >
              <ReactPlayer
                className="react-player-div"
                url={lessons[0].video.Location}
                light={image ? image.Location : "/course.png"}
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img
                src={image ? image.Location : "/course.png"}
                alt={name}
                className="img img-fluid"
              />
            </>
          )}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger mt-2" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3"
              type="primary"
              block
              shape="round"
              icon={
                user ? (
                  status ? (
                    <ArrowRightOutlined />
                  ) : (
                    <SafetyOutlined />
                  )
                ) : (
                  <UserAddOutlined />
                )
              }
              size="large"
              disabled={
                loading || user._id.toString() === instructor._id.toString()
              }
              onClick={(e) => handleEnrollment(e, paid)}
            >
              {user ? (status ? "Go to course" : "Enroll") : "Log in to enroll"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
