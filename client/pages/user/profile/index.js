import { useState, useEffect } from "react";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";
import { isEmpty } from "../../../utils/helpers";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
import ProfilePictureCard from "../../../components/cards/ProfilePictureCard";
import BalanceCard from "../../../components/cards/BalanceCard";
import UpdatePasswordCard from "../../../components/cards/UpdatePasswordCard";
import PersonalInformationCard from "../../../components/cards/PersonalInformationCard";
import Loading from "../../../components/others/Loading";

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
      if (err.response) toast.error(err.response.data);
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
      if (err.response) toast.error(err.response.data);
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
      if (err.response) toast.error(err.response.data);
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
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleTransferBalance = async () => {
    try {
      if (user.balance === 0) {
        toast.error("You currently have no balance");
        return;
      }
      await axios.post("/api/transfer-balance");
      setUser({ ...user, balance: 0 });
      setInitialUser({ ...user, balance: 0 });
      toast.success(
        "Congratulations! All your balance has been successfully transferred to your bank account!"
      );
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <UserRoute>
      <div className="container mt-5">
        <div className="main-body">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <ProfilePictureCard
                user={user}
                initialUser={initialUser}
                removingAvatar={removingAvatar}
                uploading={uploading}
                uploadBtnText={uploadBtnText}
                handleImage={handleImage}
                handleRemoveImage={handleRemoveImage}
              />
              <BalanceCard
                balance={user.balance}
                handleTransferBalance={handleTransferBalance}
              />
            </div>
            <div className="col-md-8">
              <PersonalInformationCard
                user={user}
                editing={editing}
                setEditing={setEditing}
                updating={updating}
                handleSubmit={handleSubmit}
                handleCancelEdit={handleCancelEdit}
                handleChange={handleChange}
              />
              <UpdatePasswordCard
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
    </UserRoute>
  );
};

export default UserProfile;
