import UpdatePasswordForm from "../forms/UpdatePasswordForm";

const UpdatePasswordCard = ({
  editingPassword,
  setEditingPassword,
  updatingPassword,
  password,
  handleCancelEditPassword,
  handleChangePassword,
  handleUpdatePassword,
}) => {
  return (
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
  );
};

export default UpdatePasswordCard;
