import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  // state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const becomeInstructor = () => {
    console.log("Become instructor");
    setLoading(true);
    // TODO make this async await
    axios
      .post("/api/become-instructor")
      .then((res) => {
        // open stripe
        // window.location.href = res.data;
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        window.localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/instructor";
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <h1 className="jumbotron text-center square">Become Instructor</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <UserSwitchOutlined className="display-1 pb-3" />
            <br />
            <h2>Become an instructor to publish courses on Elearn</h2>
            <p className="lead text-warning">
              Elearn is the most suitable platform for you to share your
              knowledge across the world
            </p>
            <Button
              className="mb-3"
              type="primary"
              block
              shape="round"
              icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
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
              You will be redirected to another page to complete the onboarding
              process
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
