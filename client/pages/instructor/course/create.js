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
  const [values, setValues] = useState({
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
  const [uploading, setUploading] = useState(false);
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
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSelectTag = (value) => {
    setValues({ ...values, tags: value.slice(0, 5) });
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
    if (isEmpty(values.name) || isEmpty(values.description)) {
      toast.error("Please fill in all the required fields before saving.");
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
              ...values,
              price: values.paid ? values.price : 0,
              uploadImage: uri,
            });
            pushToInstructor();
          }
        );
      } else {
        await axios.post("/api/course", {
          ...values,
          price: values.paid ? values.price : 0,
        });
        pushToInstructor();
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong. Please try again later.");
      console.log(err);
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
          values={values}
          setValues={setValues}
          preview={preview}
          uploadBtnText={uploadBtnText}
          loading={loading}
          uploading={uploading}
          handleRemoveImage={handleRemoveImage}
          handleSelectTag={handleSelectTag}
          tags={tags}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
