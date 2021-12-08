import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: false,
    tags: [],
    lessons: [],
    image: {},
    uploadImage: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [removedImage, setRemovedImage] = useState(false);

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState([]);
  const [uploadVideoBtnText, setUploadVideoBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) {
      setPreview(data.image.Location);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setPreview(window.URL.createObjectURL(file));
      setUploadBtnText(file.name);
      setImage(file);
    }
  };

  const handleRemoveImage = async () => {
    setImage(null);
    setPreview("");
    setUploadBtnText("Upload Image");
    setRemovedImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (image) {
        Resizer.imageFileResizer(
          image,
          720,
          500,
          "JPEG",
          100,
          0,
          async (uri) => {
            const { data } = await axios.put(`/api/course/${slug}`, {
              ...values,
              price: values.paid ? values.price : 0,
              removedImage,
              uploadImage: uri,
            });
            setLoading(false);
            setRemovedImage(false);
            setValues({ ...data, uploadImage: "" });
            setImage(null);
            toast.success("Course updated!");
          }
        );
      } else {
        const { data } = await axios.put(`/api/course/${slug}`, {
          ...values,
          price: values.paid ? values.price : 0,
          removedImage,
        });
        setLoading(false);
        setRemovedImage(false);
        setValues({ ...data, uploadImage: "" });
        setImage(null);
        toast.success("Course updated!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; //dragged lesosn
    allLessons.splice(movingItemIndex, 1); // remove the dragged lesson from the array
    allLessons.splice(targetItemIndex, 0, movingItem); // push the dragged lesson to the position of the target item

    setValues({ ...values, lessons: [...allLessons] });

    // save the new lessons order in database
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      price: values.paid ? values.price : 0,
    });
    toast.success("Lessons rearranged successfully!");
  };

  const handleDeleteLesson = async (index) => {
    try {
      let allLessons = values.lessons;
      const removed = allLessons.splice(index, 1);
      setValues({ ...values, lessons: allLessons });
      // send request to server
      const { data } = await axios.put(
        `/api/course/${slug}/remove-lesson/${removed[0]._id}`
      );
      toast.success("Deleted the lesson successfully");
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Lesson update functions
   */

  const handleVideo = async (e) => {
    if (e.target.files.length === 0) return;
    // remove previous video
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
    }

    // upload new one
    const file = e.target.files[0];
    setUploadVideoBtnText(file.name);
    setUploading(true);

    // send video as form data
    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    // save progress bar and send video as form data to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    setCurrent({ ...current, video: data });

    // update lesson since video changed
    await axios.put(`/api/course/lesson/${slug}/${current._id}`, current);
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadVideoBtnText("Upload Video");
    setVisible(false);
    setCurrent({});
    toast.success("Lesson Updated");

    // update the UI
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Edit Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleRemoveImage={handleRemoveImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadBtnText={uploadBtnText}
          loading={loading}
          uploading={uploading}
          editPage={true}
        />
      </div>

      <hr />

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                className="pointer"
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>

                <Popconfirm
                  title="Are you sure you want to delete this lesson?"
                  onConfirm={() => handleDeleteLesson(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="text-danger float-right" />
                </Popconfirm>
              </Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title="Update lesson"
        centered
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setCurrent({});
        }}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoBtnText={uploadVideoBtnText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
