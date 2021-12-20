import { Input, Tooltip, Popconfirm, Button } from "antd";
import { EditFilled, CloseCircleOutlined } from "@ant-design/icons";

const ChangePasswordForm = ({
  editingPassword,
  setEditingPassword,
  updatingPassword,
  handleChangePassword,
  password,
  handleCancelEditPassword,
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
                onConfirm={handleCancelEditPassword}
                okText="Yes"
                cancelText="No"
              >
                <CloseCircleOutlined
                  className="float-end lead text-secondary pointer edit-icon"
                  disabled={updatingPassword}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <EditFilled
                className="float-end lead text-secondary pointer edit-icon"
                onClick={() => setEditingPassword(true)}
                disabled={updatingPassword}
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
            name="oldPassword"
            className="form-control"
            placeholder="Old Password"
            value={password.oldPassword}
            bordered={false}
            disabled={!editingPassword}
            onChange={handleChangePassword}
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
            name="newPassword"
            className="form-control"
            placeholder="New Password"
            bordered={false}
            value={password.newPassword}
            disabled={!editingPassword}
            onChange={handleChangePassword}
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
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm Password"
            value={password.confirmPassword}
            disabled={!editingPassword}
            bordered={false}
            onChange={handleChangePassword}
          />
        </div>
      </div>
      <hr />
      <div className="row d-flex justify-content-between">
        <div className="col-sm-3 align-self-center">
          <Button
            type="primary"
            className="btn"
            disabled={!editingPassword}
            loading={updatingPassword}
            onClick={handleChangePassword}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
