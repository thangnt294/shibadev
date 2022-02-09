import { useState, useEffect, useContext } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { isEmpty } from "../../../../utils/helpers";
import EditLessonModal from "../../../../components/modal/EditLessonModal";
import EditCourseLessonList from "../../../../components/others/EditCourseLessonList";
import { Context } from "../../../../global/Context";

const CourseEdit = () => {
  // state
  const [course, setCourse] = useState({
    name: "",
    description: "",
    price: 0,
    paid: false,
    tags: [],
    lessons: [],
    image: {},
    uploadImage: "",
    published: false,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [removedImage, setRemovedImage] = useState(false);
  const [tags, setTags] = useState([]);

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [uploadVideoBtnText, setUploadVideoBtnText] = useState("Upload Video");
  const [savingLesson, setSavingLesson] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [progress, setProgress] = useState(0);

  const { dispatch } = useContext(Context);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    getTags();
  }, []);

  const loadCourse = async () => {
    dispatch({ type: "LOADING", payload: true });
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
    if (data && data.image) {
      setPreview(data.image.Location);
    }
    dispatch({ type: "LOADING", payload: false });
  };

  const getTags = async () => {
    const { data } = await axios.get("/api/course-tags");
    setTags(data);
  };

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSelectTag = (value) => {
    setCourse({ ...course, tags: value.slice(0, 5) });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (!isEmpty(file)) {
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
    try {
      setLoading(true);
      if (!isEmpty(image)) {
        Resizer.imageFileResizer(
          image,
          720,
          500,
          "JPEG",
          100,
          0,
          async (uri) => {
            const { data } = await axios.put(`/api/course/${slug}`, {
              ...course,
              price: course.paid ? course.price : 0,
              removedImage,
              uploadImage: uri,
            });
            updatedCourse(data);
          }
        );
      } else {
        const { data } = await axios.put(`/api/course/${slug}`, {
          ...course,
          price: course.paid ? course.price : 0,
          removedImage,
        });

        updatedCourse(data);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const updatedCourse = (data) => {
    setLoading(false);
    setRemovedImage(false);
    setCourse({ ...data, uploadImage: "" });
    setImage(null);
    toast.success("Course updated!");
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    try {
      const movingItemIndex = e.dataTransfer.getData("itemIndex");
      const targetItemIndex = index;
      let allLessons = course.lessons;

      let movingItem = allLessons[movingItemIndex]; //dragged lesosn
      allLessons.splice(movingItemIndex, 1); // remove the dragged lesson from the array
      allLessons.splice(targetItemIndex, 0, movingItem); // push the dragged lesson to the position of the target item

      setCourse({ ...course, lessons: [...allLessons] });

      // save the new lessons order in database
      await axios.put(`/api/course/${slug}`, {
        ...course,
        price: course.paid ? course.price : 0,
      });
      toast.success("Lessons rearranged successfully!");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleDeleteLesson = async (index) => {
    try {
      let allLessons = course.lessons;
      const removed = allLessons.splice(index, 1);
      setCourse({ ...course, lessons: allLessons });
      await axios.put(`/api/course/${slug}/remove-lesson/${removed[0]._id}`);
      toast.success("Deleted the lesson successfully");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  /**
   * Lesson update functions
   */

  const updateLessonUI = (lesson) => {
    let arr = course.lessons;
    const index = arr.findIndex((el) => el._id === lesson._id);
    arr[index] = lesson;
    setCourse({ ...course, lessons: arr });
  };

  const clearModalState = () => {
    setUploadVideoBtnText("Upload Video");
    setVisible(false);
    setLesson(null);
    setProgress(0);
    setSavingLesson(false);
  };

  const handleOpenEditLessonModal = (item) => {
    setVisible(true);
    setLesson(item);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (isEmpty(lesson.title)) {
      toast.error("Please fill in all the required fields before saving");
      return;
    }
    if (isEmpty(lesson.content) && isEmpty(lesson.video)) {
      toast.error("Please add some content or upload a video");
      return;
    }
    setSavingLesson(true);
    try {
      const { data } = await axios.put(
        `/api/course/lesson/${slug}/${lesson._id}`,
        lesson
      );
      clearModalState();
      toast.success("Lesson Updated");

      // update the UI
      if (data.ok) {
        updateLessonUI(lesson);
      }
    } catch (err) {
      console.log(err);
      setSavingLesson(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleVideo = async (e) => {
    if (e.target.files.length === 0) return;
    try {
      // remove previous video
      if (lesson.video && lesson.video.Location) {
        await axios.post(
          `/api/course/video-remove/${course.instructor._id}`,
          lesson.video
        );
      }

      // upload new one
      const file = e.target.files[0];
      setUploadVideoBtnText(file.name);
      setUploadingVideo(true);

      // send video as form data
      const videoData = new FormData();
      videoData.append("video", file);
      videoData.append("courseId", course._id);

      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      setLesson({ ...lesson, video: data });

      // update lesson since video changed
      await axios.put(`/api/course/lesson/${slug}/${lesson._id}`, {
        ...lesson,
        video: data,
      });
      updateLessonUI({ ...lesson, video: data });
      setUploadingVideo(false);
    } catch (err) {
      console.log(err);
      setUploadingVideo(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setUploading(true);
      await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        lesson.video
      );
      await axios.put(`/api/course/lesson/${slug}/${lesson._id}`, {
        ...lesson,
        video: null,
      });
      updateLessonUI({ ...lesson, video: null });
      setLesson({ ...lesson, video: null });
      setUploading(false);
      setUploadVideoBtnText("Upload Video");
      setProgress(0);
    } catch (err) {
      console.log(err);
      setUploading(false);
      if (err.response) toast.error(err.response.data);
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
          course={course}
          setCourse={setCourse}
          preview={preview}
          uploadBtnText={uploadBtnText}
          loading={loading}
          uploading={uploading}
          tags={tags}
          handleSelectTag={handleSelectTag}
          editPage={true}
        />
      </div>

      <hr />

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
          <EditCourseLessonList
            lessons={course.lessons}
            handleOpenEditLessonModal={handleOpenEditLessonModal}
            handleDeleteLesson={handleDeleteLesson}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
        </div>
      </div>
      <EditLessonModal
        visible={visible}
        lesson={lesson}
        setLesson={setLesson}
        savingLesson={savingLesson}
        handleCloseModal={clearModalState}
        handleSubmit={handleUpdateLesson}
        uploadBtnText={uploadVideoBtnText}
        handleVideo={handleVideo}
        handleRemoveVideo={handleRemoveVideo}
        uploading={uploadingVideo}
        progress={progress}
        page="edit course"
      />
    </InstructorRoute>
  );
};

export default CourseEdit;
