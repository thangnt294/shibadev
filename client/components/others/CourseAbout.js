import { Badge, Image } from "antd";
import { truncateText } from "../../utils/helpers";

const CourseAbout = ({ course }) => {
  const { name, description, instructor, lessons, updatedAt, tags, image } =
    course;
  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <h1 className="font-weight-bold">{truncateText(name, 60)}</h1>
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
          <p>{lessons.length} lessons</p>
        </div>
        <div className="col-md-4">
          <Image
            src={image ? image.Location : "/course.png"}
            alt={name}
            className="img img-fluid"
          />
        </div>
      </div>
    </>
  );
};

export default CourseAbout;
