import { useState } from "react";
import { Image, Button } from "antd";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SendEmailModal from "../modal/SendEmailModal";
import axios from "axios";
import { getUserId } from "../../utils/helpers";

const CourseInstructor = ({ instructor }) => {
  const [visible, setVisible] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  const router = useRouter();

  const handleCloseModal = () => {
    setVisible(false);
    setSendingEmail(false);
    setEmailSubject("");
    setEmailContent("");
  };

  const handleSubmit = async () => {
    setSendingEmail(true);
    try {
      console.log("Send email");
      await axios.post("/api/send-email", {
        emailTo: instructor.email,
        subject: emailSubject,
        content: emailContent,
      });
      handleCloseModal();
      toast.success("Email sent successfully");
    } catch (err) {
      console.log(err);
      handleCloseModal();
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleMessage = async () => {
    const userId = getUserId();
    const { data } = await axios.get(
      `/api/chat-room?users=${userId},${instructor._id}`
    );
    if (data) {
      router.push(`/user/messages/${data._id}`);
    } else {
      const { data } = await axios.post("/api/chat-room", {
        users: [userId, instructor._id],
      });
      router.push(`/user/messages/${data._id}`);
    }
  };

  return (
    <div className="d-flex">
      <div className="col-md-2">
        <Image
          src={
            instructor && instructor.avatar
              ? instructor.avatar.Location
              : "/avatar.png"
          }
          preview={false}
          alt="instructor avatar"
        />
        <h3 className="text-center mt-3">
          <b>{instructor?.name}</b>
        </h3>
        <h4 className="text-center lead">{instructor?.title}</h4>
        <h5 className="text-center mt-3" style={{ color: "#646966" }}>
          {instructor?.email}
        </h5>
      </div>
      <div className="col-md-10 ms-4">
        <h3>Bio</h3>
        <ReactMarkdown>{instructor?.bio}</ReactMarkdown>
        <Button onClick={() => setVisible(true)} className="me-3">
          Send an email
        </Button>
        <Button onClick={handleMessage}>Message</Button>
      </div>
      <SendEmailModal
        visible={visible}
        handleCloseModal={handleCloseModal}
        sendingEmail={sendingEmail}
        handleSubmit={handleSubmit}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
      />
    </div>
  );
};

export default CourseInstructor;
