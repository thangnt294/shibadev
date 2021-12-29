import { currencyFormatter } from "../../utils/helpers";
import { Badge, Button, Image } from "antd";
import {
  LoadingOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const SingleCourseJumbotron = ({
  course,
  user,
  loading,
  handleEnrollment,
  status,
}) => {
  const { name, description, instructor, updatedAt, image, price, paid, tags } =
    course;
  return (
    <div className="jumbotron square">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">
            {truncateText(name, 60)}
          </h1>
          <p className="lead">{truncateText(description, 200)}</p>
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <Badge
                count={tag}
                style={{ backgroundColor: "#03a9f4" }}
                className="pb-4 me-2"
                key={tag}
              />
            ))
          ) : (
            <Badge
              count="ShibaDev"
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-4 me-2"
            />
          )}

          <p>Created by {instructor.name}</p>
          <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({ amount: price, currency: "usd" })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4">
          <Image
            src={image ? image.Location : "/course.png"}
            alt={name}
            className="img img-fluid"
          />
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
                loading ||
                (user &&
                  user._id &&
                  user._id.toString() === instructor._id.toString())
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
