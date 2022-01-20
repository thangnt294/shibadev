import { useEffect, useState } from "react";
import { Image, Button } from "antd";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import SmallLoading from "../../components/others/SmallLoading";

const CourseInstructor = ({ courseInstructor }) => {
  const [instructor, setInstructor] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructor();
  }, []);

  const loadInstructor = async () => {
    const { data } = await axios.get(`/api/user/${courseInstructor._id}`);
    if (data) {
      setInstructor(data);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <SmallLoading />
      ) : (
        <div className="d-flex">
          <div className="col-md-3">
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
          <div className="col-md-9 ms-4">
            <h3>Bio</h3>
            <ReactMarkdown>{instructor?.bio}</ReactMarkdown>
            <Button>Send an email</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseInstructor;
