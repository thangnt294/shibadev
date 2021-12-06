import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: false,
    tags: [],
  });

  const [image, setImage] = useState({});
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
      setPreview(window.URL.createObjectURL(file));
      setUploadBtnText(file.name);
      setLoading(true);
      // resize image
      Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
        try {
          let { data } = await axios.post("/api/course/upload-image", {
            image: uri,
            oldImage: image,
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
    }
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
    console.log(values);
    try {
      const { data } = await axios.post("/api/course", {
        ...values,
        price: values.paid ? values.price : 0,
        image,
      });
      toast.success("Great! Now you can start adding lessons");
      router.push("/instructor");
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.log(err);
    }
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
