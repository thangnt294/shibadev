import PersonalInformationForm from "../forms/PersonalInformationForm";

const PersonalInformationCard = ({
  user,
  editing,
  setEditing,
  updating,
  handleSubmit,
  handleCancelEdit,
  handleChange,
}) => {
  return (
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
  );
};

export default PersonalInformationCard;
