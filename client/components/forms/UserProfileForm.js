import { Input, Button, Tooltip, Popconfirm } from "antd";
import { EditFilled, CloseCircleOutlined } from "@ant-design/icons";

const UserProfileForm = ({
  user,
  editing,
  setEditing,
  updating,
  handleSubmit,
  handleCancelEdit,
  handleChange,
}) => {
  const { name, email, title, address, bio } = user;
  return (
    <>
      <div className="d-flex pb-3">
        <h4>Personal Information</h4>
        <div className="col">
          {editing ? (
            <Tooltip title="Cancel">
              <Popconfirm
                title="All your unsaved changes will be discarded. Are you sure?"
                onConfirm={handleCancelEdit}
                okText="Yes"
                cancelText="No"
              >
                <CloseCircleOutlined
                  className="float-end lead text-secondary pointer edit-icon"
                  disabled={updating}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <EditFilled
                className="float-end lead text-secondary pointer edit-icon"
                onClick={() => setEditing(true)}
                disabled={updating}
              />
            </Tooltip>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">
            Full Name <span className="text-danger">*</span>
          </h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="name"
            className="form-control"
            placeholder="Name"
            value={name}
            disabled={!editing}
            bordered={false}
            onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">
            Email <span className="text-danger">*</span>
          </h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="email"
            className="form-control"
            placeholder="Email"
            value={email}
            disabled
            bordered={false}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Title</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="title"
            className="form-control"
            placeholder="Title"
            value={title}
            disabled={!editing}
            bordered={false}
            onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Address</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="address"
            className="form-control"
            placeholder="Address"
            value={address}
            disabled={!editing}
            bordered={false}
            onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Bio</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input.TextArea
            name="bio"
            className="form-control"
            placeholder="Bio"
            value={bio}
            disabled={!editing}
            bordered={false}
            onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row d-flex justify-content-between">
        <div className="col-sm-3 align-self-center">
          <Button
            type="primary"
            className="btn"
            disabled={!editing}
            loading={updating}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserProfileForm;
