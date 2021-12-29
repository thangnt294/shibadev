import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { isEmpty } from "../../../utils/helpers";

const CourseCreate = () => {
  // state
  const [course, setCourse] = useState({
    name: "",
    description: "",
    price: 0,
    paid: false,
    tags: [],
    image: {},
    uploadImage: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    const { data } = await axios.get("/api/course-tags");
    setTags(data);
  };

  // router
  const router = useRouter();

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSelectTag = (value) => {
    setCourse({ ...course, tags: value.slice(0, 5) });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      setPreview(window.URL.createObjectURL(file));
      setImage(file);
      setUploadBtnText(
        fileName.length > 12 ? `${fileName.slice(0, 12)}...` : fileName
      );
    }
  };

  const handleRemoveImage = async () => {
    setImage(null);
    setPreview("");
    setUploadBtnText("Upload Image");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(course.name) || isEmpty(course.description)) {
      toast.error("Please fill in all the required fields before saving");
      return;
    }
    setLoading(true);
    try {
      if (!isEmpty(image)) {
        Resizer.imageFileResizer(
          image,
          720,
          500,
          "JPEG",
          100,
          0,
          async (uri) => {
            await axios.post("/api/course", {
              ...course,
              price: course.paid ? course.price : 0,
              uploadImage: uri,
            });
            pushToInstructor();
          }
        );
      } else {
        await axios.post("/api/course", {
          ...course,
          price: course.paid ? course.price : 0,
        });
        pushToInstructor();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const pushToInstructor = () => {
    setLoading(false);
    toast.success("Great! Now you can start adding lessons");
    router.push("/instructor");
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          course={course}
          setCourse={setCourse}
          preview={preview}
          uploadBtnText={uploadBtnText}
          loading={loading}
          handleRemoveImage={handleRemoveImage}
          handleSelectTag={handleSelectTag}
          tags={tags}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
