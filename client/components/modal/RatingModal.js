import { Modal, Rate } from "antd";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const RatingModal = ({
  visible,
  handleCloseModal,
  handleSubmit,
  rating,
  setRating,
  savingRating,
}) => {
  return (
    <Modal
      title="Rate this course"
      centered
      visible={visible}
      onCancel={handleCloseModal}
      onOk={handleSubmit}
      confirmLoading={savingRating}
    >
      <div className="text-center">
        <span>
          <Rate
            allowHalf
            defaultValue={2.5}
            disabled={savingRating}
            value={rating}
            tooltips={desc}
            onChange={(val) => setRating(val)}
          />
        </span>
      </div>
    </Modal>
  );
};

export default RatingModal;
