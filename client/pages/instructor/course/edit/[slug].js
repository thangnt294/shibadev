import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
import { set } from "mongoose";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: false,
    category: "",
    lessons: [],
  });

  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState([]);
  const [uploadVideoBtnText, setUploadVideoBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadBtnText(file.name);
    setLoading(true);

    // resize image
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("IMAGE UPLOADED", data);
        // set image in the state, set loading to false
        setImage(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        toast.error("Image upload failed. Please try again later.");
      }
    });
  };

  const handleRemoveImage = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadBtnText("Upload Image");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Image remove failed. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        price: paid ? price : 0,
        image,
      });
      toast.success("Course updated!");
      // router.push("/instructor");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setItem("itemIndex", index);
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
      price: paid ? price : 0,
      image,
    });
    toast.success("Lessons rearranged successfully!");
  };

  const handleDeleteLesson = async (index) => {
    const answer = window.confirm(
      "Are you sure you want to delete the lesson?"
    );
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });
    // send request to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    toast.success("Deleted lesson");
  };

  /**
   * Lesson update functions
   */

  const handleVideo = async (e) => {
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

                <DeleteOutlined
                  onClick={() => handleDeleteLesson(index)}
                  className="text-danger float-right"
                />
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
