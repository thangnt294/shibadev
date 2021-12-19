import { Input, Button } from "antd";
import { EditFilled } from "@ant-design/icons";

const UserProfileForm = ({ user, editing, setEditing }) => {
  const { name, email, title, address, bio } = user;
  return (
    <>
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
            placeholder="Name *"
            value={name}
            disabled
            bordered={false}
            // onChange={handleChange}
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
            // onChange={handleChange}
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
            disabled
            bordered={false}
            // onChange={handleChange}
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
            disabled
            bordered={false}
            // onChange={handleChange}
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
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row d-flex justify-content-between">
        <div className="col-sm-3 align-self-center">
          <Button type="primary" className="btn">
            Save
          </Button>
        </div>
        <div className="col me-2 align-self-center">
          <EditFilled
            className="float-end lead text-secondary pointer edit-icon"
            onClick={() => setEditing(!editing)}
          />
        </div>
      </div>
    </>
  );
};

export default UserProfileForm;
