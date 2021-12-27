import { Badge, Tooltip, Popconfirm, Space, Image, Button } from "antd";
import {
  EditOutlined,
  StopOutlined,
  UploadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { truncateText } from "../../utils/helpers";

const InstructorCourseHeader = ({
  course,
  studentCount,
  handlePublish,
  handleUnpublish,
  setVisible,
  handleRouteToEditCourse,
  handleOpenAddLessonModal,
}) => {
  const { image, name, lessons, description, tags, published, _id } = course;

  return (
    <>
      <div className="d-flex">
        <Image
          width={410}
          src={image ? image.Location : "/course.png"}
          preview={false}
        />

        <div className="ps-4">
          <div className="row">
            <h1 className="text-primary mb-2">{truncateText(name, 60)}</h1>
            <p>
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge
                    count={tag}
                    style={{ backgroundColor: "#03a9f4" }}
                    className="me-2"
                    key={tag}
                  />
                ))
              ) : (
                <Badge
                  count="ShibaDev"
                  style={{ backgroundColor: "#03a9f4" }}
                  className="me-2"
                />
              )}
            </p>
            <p className="lead mb-1">{lessons.length} lessons</p>
            <p className="lead">{studentCount} students enrolled</p>
            <div className="d-flex">
              <Space size={20} align="center">
                <Button
                  type="primary"
                  disabled={published}
                  onClick={handleOpenAddLessonModal}
                >
                  <PlusCircleOutlined />
                  Add lesson
                </Button>

                <Button
                  // type="primary"
                  className={!published && "bg-warning text-white"}
                  disabled={published}
                  onClick={handleRouteToEditCourse}
                >
                  <EditOutlined />
                  Edit
                </Button>

                {published ? (
                  <Popconfirm
                    title="Once you unpublish your course, it will not be available for users to enroll anymore"
                    onConfirm={() => handleUnpublish(course._id)}
                    okText="Unpublish"
                    cancelText="Cancel"
                  >
                    <Button className="bg-danger text-white">
                      <StopOutlined onClick={handleUnpublish} />
                      Unpublish
                    </Button>
                  </Popconfirm>
                ) : (
                  <>
                    <Tooltip
                      title={
                        lessons && lessons.length < 5
                          ? "Min 5 lessons required to publish"
                          : ""
                      }
                    >
                      <Popconfirm
                        title="Once you publish your course, it will be live on the marketplace for users to enroll"
                        onConfirm={() => handlePublish(course._id)}
                        okText="Publish"
                        cancelText="Cancel"
                      >
                        <Button
                          className="bg-success text-white"
                          disabled={lessons && lessons.length < 5}
                        >
                          <UploadOutlined onClick={handlePublish} />
                          Publish
                        </Button>
                      </Popconfirm>
                    </Tooltip>
                  </>
                )}
              </Space>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default InstructorCourseHeader;
