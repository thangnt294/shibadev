import { Card, Badge, Rate } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";
import { MinusCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const CourseCard = ({ course, page }) => {
  const {
    name,
    instructor,
    price,
    image,
    slug,
    paid,
    tags,
    lessons,
    published,
    avgRating,
  } = course;

  const getLink = () => {
    switch (page) {
      case "home":
        return `/course/${slug}`;
      case "wishlist":
        return `/course/${slug}`;
      case "instructor":
        return `/instructor/course/view/${slug}`;
      default:
        return `/user/course/${slug}`;
    }
  };
  return (
    <Link href={getLink()}>
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
          <h3 className="font-weight-bold">{truncateText(name, 200)}</h3>
          {page === "home" || page === "wishlist" ? (
            <p>by {instructor.name}</p>
          ) : (
            <p>{lessons.length} lessons</p>
          )}
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
              count="ShibaDev"
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-2 me-2"
            />
          )}

          {page === "home" || page === "wishlist" ? (
            <div>
              <Rate allowHalf disabled value={avgRating} />
              <h4 className="pt-2">
                {paid
                  ? currencyFormatter({ amount: price, currency: "usd" })
                  : "Free"}
              </h4>
            </div>
          ) : page === "instructor" ? (
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
                <p className="text-info">
                  Your course is ready to be published
                </p>
              )}
            </div>
          ) : (
            <p>by {instructor.name}</p>
          )}
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
