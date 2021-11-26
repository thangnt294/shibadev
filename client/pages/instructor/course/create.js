import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: false,
    category: "",
  });

  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
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
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
    </InstructorRoute>
  );
};

export default CourseCreate;
