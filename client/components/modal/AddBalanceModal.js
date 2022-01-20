import { Modal, Input } from "antd";

const AddBalanceModal = ({
  addBalanceModalVisible,
  addingBalance,
  addBalance,
  setAddBalance,
  handleCloseAddBalanceModal,
  handleAddBalance,
}) => {
  return (
    <Modal
      title={"Add Balance"}
      centered
      visible={addBalanceModalVisible}
      onCancel={handleCloseAddBalanceModal}
      confirmLoading={addingBalance}
      onOk={handleAddBalance}
    >
      <Input
        prefix="$"
        type="number"
        placeholder="Amount *"
        className="form-control square"
        onChange={(e) => setAddBalance(e.target.value)}
        value={addBalance}
        autoFocus
        disabled={addingBalance}
        required
      />
    </Modal>
  );
};

export default AddBalanceModal;
