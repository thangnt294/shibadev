import { Input, Tooltip, Popconfirm } from "antd";
import { EditFilled, CloseCircleOutlined } from "@ant-design/icons";

const ChangePasswordForm = ({
  editingPassword,
  setEditingPassword,
  udpatingPassword,
}) => {
  return (
    <>
      <div className="d-flex pb-3">
        <h4>Update password</h4>
        <div className="col">
          {editingPassword ? (
            <Tooltip title="Cancel">
              <Popconfirm
                title="All your unsaved changes will be discarded. Are you sure?"
                onConfirm={handleCancelEdit}
                okText="Yes"
                cancelText="No"
              >
                <CloseCircleOutlined
                  className="float-end lead text-secondary pointer edit-icon"
                  disabled={udpatingPassword}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <EditFilled
                className="float-end lead text-secondary pointer edit-icon"
                onClick={() => setEditingPassword(true)}
                disabled={udpatingPassword}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Old Password</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="name"
            className="form-control"
            placeholder="Name"
            // value={name}
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">New Password</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="email"
            className="form-control"
            placeholder="Email"
            bordered={false}
            // value={email}
            disabled
            // bordered={false}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Confirm Password</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          <Input
            name="title"
            className="form-control"
            placeholder="Title"
            // value={title}
            // disabled={!editing}
            bordered={false}
            // onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
