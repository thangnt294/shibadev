import { Modal, Input } from "antd";

const { TextArea } = Input;

const SendEmailModal = ({
  visible,
  handleCloseModal,
  sendingEmail,
  handleSubmit,
  emailSubject,
  setEmailSubject,
  emailContent,
  setEmailContent,
}) => {
  return (
    <Modal
      title="Send Message"
      centered
      visible={visible}
      onCancel={handleCloseModal}
      confirmLoading={sendingEmail}
      onOk={handleSubmit}
    >
      <Input
        placeholder="Subject *"
        type="text"
        maxLength={30}
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        className="mb-3"
        size="large"
      />
      <TextArea
        placeholder="Content *"
        showCount
        maxLength={400}
        style={{ height: "15rem" }}
        value={emailContent}
        size="large"
        onChange={(e) => setEmailContent(e.target.value)}
      />
    </Modal>
  );
};

export default SendEmailModal;
