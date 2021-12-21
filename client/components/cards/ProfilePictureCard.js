import { Image, Space, Badge, Button } from "antd";

const ProfilePictureCard = ({
  user,
  initialUser,
  removingAvatar,
  uploading,
  uploadBtnText,
  handleImage,
  handleRemoveImage,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          <Image
            src={user && user.avatar ? user.avatar.Location : "/avatar.png"}
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
  );
};

export default ProfilePictureCard;
