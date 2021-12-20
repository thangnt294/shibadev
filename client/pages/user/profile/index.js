import { useState, useEffect } from "react";
import axios from "axios";
import { Image, Button } from "antd";
import UserProfileForm from "../../../components/forms/UserProfileForm";
import ChangePasswordForm from "../../../components/forms/ChangePasswordForm";
import UserRoute from "../../../components/routes/UserRoute";
import { isEmpty } from "../../../utils/helpers";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [initialUser, setInitialUser] = useState(null);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingPasword, setEditingPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/current-user");
      setUser(data);
      setInitialUser(data);
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong. Please refresh the page.");
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    try {
      let file = e.target.files[0];
      if (!isEmpty(file)) {
        const fileName = file.name;
        setUploadBtnText(
          fileName.length > 12 ? `${fileName.slice(0, 12)}...` : fileName
        );
        Resizer.imageFileResizer(
          file,
          720,
          500,
          "JPEG",
          100,
          0,
          async (uri) => {
            setUploading(true);
            const user = await axios.post("/api/user/upload-avatar", {
              image: uri,
            });

            setUser(user);
            setInitialUser(user);
            setUploading(false);
          }
        );
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = async () => {
    try {
      const user = await axios.post("/api/user/remove-avatar");
      setUser(user);
      setInitialUser(user);
      setUploadBtnText("Upload Image");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      if (isEmpty(user.name)) {
        toast.error("Plese fill in all the required fields before saving");
        return;
      }
      const user = await axios.put("/api/user", user);
      setUser(user);
      setInitialUser(user);
      setEditing(false);
      setUpdating(false);
    } catch (err) {
      console.log(err);
      setUpdating(false);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleCancelEdit = () => {
    setUser(initialUser);
    setEditing(false);
  };

  return (
    !loading && (
      <UserRoute>
        <div className="container mt-5">
          <div className="main-body">
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <Image
                        src={
                          user && user.image
                            ? user.image.Location
                            : "/avatar.png"
                        }
                        alt="Avatar"
                        preview={false}
                      />
                      <div className="mt-3">
                        <h4>{initialUser && initialUser.name}</h4>
                        <p className="text-secondary mb-1">
                          {initialUser && initialUser.title}
                        </p>
                        <p className="text-muted font-size-sm">
                          {initialUser && initialUser.address}
                        </p>
                        <label className="btn btn-primary me-2">
                          {uploadBtnText}
                          <input
                            type="file"
                            name="image"
                            onChange={handleImage}
                            accept="image/*"
                            hidden
                          />
                        </label>
                        <Button
                          className="btn bg-danger text-white"
                          size="large"
                          disabled={!(user && user.image) || uploading}
                          onClick={handleRemoveImage}
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <UserProfileForm
                      user={user}
                      editing={editing}
                      setEditing={setEditing}
                      updating={updating}
                      handleSubmit={handleSubmit}
                      handleCancelEdit={handleCancelEdit}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <ChangePasswordForm
                      editingPasword={editingPasword}
                      setEditingPassword={setEditingPassword}
                      updatingPassword={updatingPassword}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserRoute>
    )
  );
};

export default UserProfile;
