import { useState, useEffect } from "react";
import axios from "axios";
import { Image, Button, Badge, Space } from "antd";
import PersonalInformationForm from "../../../components/forms/PersonalInformationForm";
import UpdatePasswordForm from "../../../components/forms/UpdatePasswordForm";
import UserRoute from "../../../components/routes/UserRoute";
import { isEmpty } from "../../../utils/helpers";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [initialUser, setInitialUser] = useState(null);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong. Please refresh the page");
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    try {
      let file = e.target.files[0];
      if (!isEmpty(file)) {
        setUploading(true);
        const fileName = file.name;
        const text =
          fileName.length > 18 ? `${fileName.slice(0, 18)}...` : fileName;
        setUploadBtnText(text);
        Resizer.imageFileResizer(
          file,
          720,
          500,
          "JPEG",
          100,
          0,
          async (uri) => {
            const { data } = await axios.post("/api/user/upload-avatar", {
              image: uri,
            });

            setUser(data);
            setInitialUser(data);
            setUploading(false);
          }
        );
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error(err.response.data);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = async () => {
    try {
      setRemovingAvatar(true);
      const { data } = await axios.post("/api/user/remove-avatar");
      setUser(data);
      setInitialUser(data);
      setUploadBtnText("Upload Image");
      setRemovingAvatar(false);
    } catch (err) {
      console.log(err);
      setRemovingAvatar(false);
      toast.error(err.response.data);
    }
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      if (isEmpty(user.name)) {
        toast.error("Plese fill in all the required fields before saving");
        return;
      }
      const { data } = await axios.put("/api/user", user);
      toast.success("Updated successfully");
      setUser(data);
      setInitialUser(data);
      setEditing(false);
      setUpdating(false);
    } catch (err) {
      console.log(err);
      setUpdating(false);
      toast.error(err.response.data);
    }
  };

  const handleCancelEdit = () => {
    setUser(initialUser);
    setEditing(false);
  };

  const handleCancelEditPassword = () => {
    setPassword({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditingPassword(false);
  };

  const handleChangePassword = async (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async () => {
    try {
      if (
        isEmpty(password.oldPassword) ||
        isEmpty(password.newPassword) ||
        isEmpty(password.confirmPassword)
      ) {
        toast.error("Please fill in all the required fields before saving");
        return;
      }

      if (password.newPassword !== password.confirmPassword) {
        toast.error(
          "Confirm password does not match new password. Please make sure that they match each other"
        );
        return;
      }

      setUpdatingPassword(true);
      await axios.post("/api/change-password", password);
      setUpdatingPassword(false);
      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Your password has been successfully updated");
    } catch (err) {
      console.log(err);
      setUpdatingPassword(false);
      toast.error(err.response.data);
    }
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
                          user && user.avatar
                            ? user.avatar.Location
                            : "/avatar.png"
                        }
                        alt="Avatar"
                        preview={false}
                      />
                      <div>
                        <Space className="mt-2">
                          {user &&
                            user.role &&
                            user.role.map((role) => (
                              <Badge
                                count={role}
                                style={{ backgroundColor: "#2dbce3" }}
                                key={role}
                              />
                            ))}
                        </Space>
                      </div>
                      <div className="mt-3">
                        <h4>{initialUser && initialUser.name}</h4>
                        <p className="text-secondary mb-1">
                          {initialUser && initialUser.title}
                        </p>
                        <p className="text-muted font-size-sm">
                          {initialUser && initialUser.address}
                        </p>
                        <Button
                          className="btn bg-primary text-white me-2 pointer"
                          size="large"
                          disabled={removingAvatar}
                          loading={uploading}
                        >
                          <label className="pointer">
                            {uploadBtnText}
                            <input
                              type="file"
                              name="image"
                              onChange={handleImage}
                              accept="image/*"
                              hidden
                            />
                          </label>
                        </Button>

                        <Button
                          className="btn bg-danger text-white"
                          size="large"
                          disabled={!(user && user.avatar) || uploading}
                          onClick={handleRemoveImage}
                          loading={removingAvatar}
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
                    <PersonalInformationForm
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
                    <UpdatePasswordForm
                      editingPassword={editingPassword}
                      setEditingPassword={setEditingPassword}
                      updatingPassword={updatingPassword}
                      password={password}
                      handleUpdatePassword={handleUpdatePassword}
                      handleCancelEditPassword={handleCancelEditPassword}
                      handleChangePassword={handleChangePassword}
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
