import { Badge, Tooltip, Popconfirm, Space, Image } from "antd";
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
            <h1 className="text-primary">{truncateText(name, 60)}</h1>
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
            <p className="lead">{lessons.length} lessons</p>
            <p className="lead">{studentCount} students enrolled</p>
            <div className="d-flex">
              <Space size={20} align="center">
                <Tooltip title="Add lesson">
                  <PlusCircleOutlined
                    className="h5 pointer text-warning"
                    onClick={() => setVisible(true)}
                  />
                </Tooltip>

                <Tooltip title="Edit">
                  <EditOutlined
                    onClick={handleRouteToEditCourse}
                    className="h5 pointer text-primary"
                  />
                </Tooltip>

                {lessons && lessons.length < 5 ? (
                  <Tooltip title="Min 5 lessons required to publish">
                    <StopOutlined className="h5 pointer text-warning" />
                  </Tooltip>
                ) : published ? (
                  <Popconfirm
                    title="Once you unpublish your course, it will not be available for users to enroll anymore."
                    onConfirm={() => handleUnpublish(_id)}
                    okText="Unpublish"
                    cancelText="Cancel"
                  >
                    <Tooltip title="Unpublish">
                      <StopOutlined className="h5 pointer text-danger" />
                    </Tooltip>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="Once you publish your course, it will be live on the marketplace for users to enroll."
                    onConfirm={() => handlePublish(_id)}
                    okText="Publish"
                    cancelText="Cancel"
                  >
                    <Tooltip title="Publish">
                      <UploadOutlined className="h5 pointer text-success" />
                    </Tooltip>
                  </Popconfirm>
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
