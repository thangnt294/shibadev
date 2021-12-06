import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  CloseOutlined,
  UserSwitchOutlined,
  StopOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const { Item } = List;

const CourseView = () => {
  const [course, setCourse] = useState(null);
  // for lessons
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  // student count
  const [studentCount, setStudentCount] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && countStudent();
  }, [course]);

  const countStudent = async () => {
    const { data } = await axios.get(
      `/api/instructor/student-count/${course._id}`
    );

    setStudentCount(data);
  };

  const loadCourse = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
    setLoading(false);
  };

  // Function for adding lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: "", content: "", video: "" });
      setProgress(0);
      setUploadBtnText("Upload Video");
      setVisible(false);
      setCourse(data);
      toast.success("Lesson added");
    } catch (err) {
      console.log(err);
      toast.error("Add lesson failed");
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadBtnText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      // once response is received
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
      toast.success("Uploaded video successfully");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Video upload failed");
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadBtnText("Upload Video");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Video remove failed");
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live on the marketplace for users to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`api/course/publish/${courseId}`);
      setCourse(data);
      toast.success("Congrats! Your course is now live on the marketplace");
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it will not be available for users to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.success("Your course is unpublished");
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    !loading && (
      <InstructorRoute>
        <div className="container-fluid pt-3">
          {course && (
            <div className="container-fluid pt-1">
              <div className="d-flex pt-2">
                <Avatar
                  size={80}
                  src={course.image ? course.image.Location : "/course.png"}
                />

                <div className="ps-3 w-100">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="mt-2 text-primary">{course.name}</h5>
                      <p style={{ marginTop: "-10px" }}>
                        {course.lessons && course.lessons.length} Lessons
                      </p>
                      <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                        {course.category}
                      </p>
                    </div>
                    <div className="col-md-4 d-flex pt-4">
                      <Tooltip
                        title={`${studentCount} enrolled`}
                        className="me-4"
                      >
                        <UserSwitchOutlined className="h5 pointer text-info" />
                      </Tooltip>

                      <Tooltip title="Edit" className="me-4">
                        <EditOutlined
                          onClick={() =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-primary"
                        />
                      </Tooltip>

                      {course.lessons && course.lessons.length < 5 ? (
                        <Tooltip title="Min 5 lessons required to publish">
                          <StopOutlined className="h5 pointer text-warning" />
                        </Tooltip>
                      ) : course.published ? (
                        <Tooltip title="Unpublish">
                          <CloseOutlined
                            onClick={(e) => handleUnpublish(e, course._id)}
                            className="h5 pointer text-danger"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <CheckOutlined
                            onClick={(e) => handlePublish(e, course._id)}
                            className="h5 pointer text-success"
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <ReactMarkdown>{course.description}</ReactMarkdown>
                </div>
              </div>
              <div className="row">
                <Button
                  onClick={() => setVisible(true)}
                  className="col-md-4 offset-md-3 text-center"
                  type="primary"
                  shape="round"
                  icon={<PlusCircleOutlined />}
                  size="large"
                >
                  Add Lesson
                </Button>
              </div>

              <Modal
                title="Add a new lesson"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
              >
                <AddLessonForm
                  values={values}
                  setValues={setValues}
                  handleAddLesson={handleAddLesson}
                  uploading={uploading}
                  uploadBtnText={uploadBtnText}
                  handleVideo={handleVideo}
                  progress={progress}
                  handleRemoveVideo={handleRemoveVideo}
                />
              </Modal>

              <div className="row pb-5 mt-4">
                <div className="col lesson-list">
                  <h4>
                    {course && course.lessons && course.lessons.length} Lessons
                  </h4>
                  <List
                    itemLayout="horizontal"
                    dataSource={course && course.lessons}
                    renderItem={(item, index) => (
                      <Item>
                        <Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                        ></Item.Meta>
                      </Item>
                    )}
                  ></List>
                </div>
              </div>
            </div>
          )}
        </div>
      </InstructorRoute>
    )
  );
};

export default CourseView;
