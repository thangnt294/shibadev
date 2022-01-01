import { Badge, Tooltip, Popconfirm, Space, Image, Button } from "antd";
import {
  EditOutlined,
  StopOutlined,
  UploadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { truncateText } from "../../utils/helpers";

const InstructorCourseHeader = ({
  course,
  studentCount,
  handlePublish,
  handleUnpublish,
  handleRouteToEditCourse,
  handleOpenAddLessonModal,
}) => {
  const { image, name, lessons, tags, published, _id } = course;

  return (
    <div className="jumbotron square instructor-course-view-header">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">
            {truncateText(name, 60)}
          </h1>
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
          <p className="lead mb-1">{lessons.length} lessons</p>
          <p className="lead">{studentCount} students enrolled</p>
          <Button
            type="primary"
            disabled={published}
            onClick={handleOpenAddLessonModal}
            className="me-3 mb-2"
          >
            <PlusCircleOutlined />
            Add lesson
          </Button>

          <Button
            disabled={published}
            onClick={handleRouteToEditCourse}
            className={`me-3 mb-2 ${!published && "bg-warning text-white"}`}
          >
            <EditOutlined />
            Edit
          </Button>

          {published ? (
            <Popconfirm
              title="Once you unpublish your course, it will not be available for users to enroll anymore"
              onConfirm={() => handleUnpublish(_id)}
              okText="Unpublish"
              cancelText="Cancel"
            >
              <Button className="bg-danger text-white mb-2">
                <StopOutlined onClick={handleUnpublish} />
                Unpublish
              </Button>
            </Popconfirm>
          ) : (
            <Tooltip
              title={
                lessons && lessons.length < 5
                  ? "Min 5 lessons required to publish"
                  : ""
              }
            >
              <Popconfirm
                title="Once you publish your course, it will be live on the marketplace for users to enroll"
                onConfirm={() => handlePublish(_id)}
                okText="Publish"
                cancelText="Cancel"
                disabled={lessons && lessons.length < 5}
              >
                <Button
                  className="bg-success text-white mb-2"
                  disabled={lessons && lessons.length < 5}
                >
                  <UploadOutlined onClick={handlePublish} />
                  Publish
                </Button>
              </Popconfirm>
            </Tooltip>
          )}
        </div>
        <div className="col-md-4">
          <Image
            src={image ? image.Location : "/course.png"}
            alt={name}
            className="img img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseHeader;
