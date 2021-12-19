import { Input } from "antd";

const UserProfileForm = ({ user }) => {
  return (
    <>
      <div class="row">
        <div class="col-sm-3">
          <h6 class="mb-0">Full Name</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <Input
            name="name"
            className="form-control"
            placeholder="Name *"
            value={user.name}
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-3">
          <h6 class="mb-0">Email</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <Input
            name="email"
            className="form-control"
            placeholder="Email"
            value={user.email}
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-3">
          <h6 class="mb-0">Title</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <Input
            name="title"
            className="form-control"
            placeholder="Title"
            value={user.title}
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-3">
          <h6 class="mb-0">Address</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <Input
            name="address"
            className="form-control"
            placeholder="Address"
            value={user.address}
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-3">
          <h6 class="mb-0">Bio</h6>
        </div>
        <div class="col-sm-9 text-secondary">
          <Input.TextArea
            name="bio"
            className="form-control"
            placeholder="Bio"
            value={user.bio}
            disabled
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default UserProfileForm;
