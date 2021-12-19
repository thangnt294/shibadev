import { useState, useEffect } from "react";
import axios from "axios";
import { Image, Button } from "antd";
import UserProfileForm from "../../../components/forms/UserProfileForm";
import Loading from "../../../components/others/Loading";
import UserRoute from "../../../components/routes/UserRoute";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/current-user");
      setUser(data);
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong. Please refresh the page.");
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      setUploadBtnText(
        fileName.length > 12 ? `${fileName.slice(0, 12)}...` : fileName
      );
      Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
        const user = await axios.post("/api/user/upload-avatar", {
          image: uri,
        });

        setUser(user);
      });
    }
  };

  const handleRemoveImage = async () => {
    const user = await axios.post("/api/user/remove-avatar");
    setUser(user);
    setUploadBtnText("Upload Image");
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
                        <h4>{user && user.name}</h4>
                        <p className="text-secondary mb-1">
                          {user && user.title}
                        </p>
                        <p className="text-muted font-size-sm">
                          {user && user.address}
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
                          disabled={!(user && user.image)}
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
