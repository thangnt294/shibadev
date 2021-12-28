import { useContext, useState } from "react";
import { Context } from "../../global/Context";
import { Button } from "antd";
import axios from "axios";
import {
  CheckSquareOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const BecomeInstructor = () => {
  // state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const becomeInstructor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/become-instructor");
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      setLoading(false);
      window.localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/instructor";
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center square">Become Instructor</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <UserSwitchOutlined className="display-1 pb-3" />
            <br />
            <h2>
              Become an instructor to start publishing courses on ShibaDev!
            </h2>
            <p className="lead text-warning">
              ShibaDev is the most suitable platform for you to share your
              knowledge across the world. At Elearn, you can easily create and
              publish your courses, and start earning profits as more students
              enroll. Knowledge is most useful when shared to others!
            </p>
            <Button
              className="mb-3"
              type="primary"
              block
              shape="round"
              icon={loading ? <LoadingOutlined /> : <CheckSquareOutlined />}
              size="large"
              onClick={becomeInstructor}
              disabled={
                (user && user.role && user.role.includes["Instructor"]) ||
                loading
              }
            >
              {loading ? "Processing..." : "Become Instructor"}
            </Button>
            <p className="lead">
              You will be redirected to another page after registering to become
              an instructor.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
