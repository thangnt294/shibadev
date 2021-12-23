import { Card, Badge } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const InstructorCourseCard = ({ course }) => {
  const { name, image, slug, tags, lessons, published } = course;
  return (
    <Link href={`/instructor/course/view/${slug}`}>
      <a>
        <Card
          hoverable={true}
          className="mb-4"
          cover={
            <img
              src={image ? image.Location : "/course.png"}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            />
          }
          size="small"
        >
          <h4 className="font-weight-bold">{name}</h4>
          <p>{lessons.length} lessons</p>
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <Badge
                count={tag}
                style={{ backgroundColor: "#03a9f4" }}
                className="pb-2 me-2"
                key={tag}
              />
            ))
          ) : (
            <Badge
              count="No tag"
              style={{ backgroundColor: "#b33105" }}
              className="pb-2 me-2"
            />
          )}
          <div className="d-flex">
            {published ? (
              <CheckCircleOutlined className="text-success pe-2 mt-1" />
            ) : lessons.length < 5 ? (
              <MinusCircleOutlined className="text-warning pe-2 mt-1" />
            ) : (
              <CheckCircleOutlined className="text-info pe-2 mt-1" />
            )}
            {lessons.length < 5 ? (
              <p className="text-warning">
                At least 5 lessons are required to publish a course
              </p>
            ) : published ? (
              <p className="text-success">
                Your course is live on the marketplace
              </p>
            ) : (
              <p className="text-info">Your course is ready to be published</p>
            )}
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default InstructorCourseCard;
