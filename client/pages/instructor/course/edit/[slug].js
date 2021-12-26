import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { isEmpty } from "../../../../utils/helpers";
import EditLessonModal from "../../../../components/modal/EditLessonModal";
import EditCourseLessonList from "../../../../components/others/EditCourseLessonList";

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
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
    const { data } = await axios.get(`/api/course/${slug}`);
    setValues(data);
    if (data && data.image) {
      setPreview(data.image.Location);
    }
  };

  const getTags = async () => {
    const { data } = await axios.get("/api/course-tags");
    setTags(data);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSelectTag = (value) => {
    setValues({ ...values, tags: value.slice(0, 5) });
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
              ...values,
              price: values.paid ? values.price : 0,
              removedImage,
              uploadImage: uri,
            });
            updatedCourse(data);
          }
        );
      } else {
        const { data } = await axios.put(`/api/course/${slug}`, {
          ...values,
          price: values.paid ? values.price : 0,
          removedImage,
        });

        updatedCourse(data);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  const updatedCourse = (data) => {
    setLoading(false);
    setRemovedImage(false);
    setValues({ ...data, uploadImage: "" });
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
      let allLessons = values.lessons;

      let movingItem = allLessons[movingItemIndex]; //dragged lesosn
      allLessons.splice(movingItemIndex, 1); // remove the dragged lesson from the array
      allLessons.splice(targetItemIndex, 0, movingItem); // push the dragged lesson to the position of the target item

      setValues({ ...values, lessons: [...allLessons] });

      // save the new lessons order in database
      await axios.put(`/api/course/${slug}`, {
        ...values,
        price: values.paid ? values.price : 0,
      });
      toast.success("Lessons rearranged successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleDeleteLesson = async (index) => {
    try {
      let allLessons = values.lessons;
      const removed = allLessons.splice(index, 1);
      setValues({ ...values, lessons: allLessons });
      await axios.put(`/api/course/${slug}/remove-lesson/${removed[0]._id}`);
      toast.success("Deleted the lesson successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  /**
   * Lesson update functions
   */

  const clearModalState = () => {
    setUploadVideoBtnText("Upload Video");
    setVisible(false);
    setLesson(null);
    setSavingLesson(false);
  };

  const handleCloseModal = () => {
    if (lesson.video) {
      // TODO remove video
    }
    setVisible(false);
    setLesson(null);
  };

  const handleOpenEditLessonModal = () => {
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
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === lesson._id);
        arr[index] = lesson;
        setValues({ ...values, lessons: arr });
      }
    } catch (err) {
      console.log(err);
      setSavingLesson(false);
      toast.error(err.response.data);
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
          tags={tags}
          handleSelectTag={handleSelectTag}
          editPage={true}
        />
      </div>

      <hr />

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <EditCourseLessonList
            lessons={values.lessons}
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
        courseSlug={slug}
        savingLesson={savingLesson}
        courseId={values && values._id}
        instructorId={values && values.instructor && values.instructor._id}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleUpdateLesson}
      />
    </InstructorRoute>
  );
};

export default CourseEdit;
