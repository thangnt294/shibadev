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
  } = useContext(Context);

  const becomeInstructor = () => {
    console.log("Become instructor");
    setLoading(true);
    // TODO make this async await
    axios
      .post("/api/make-instructor")
      .then((res) => {
        console.log(res);
        // open stripe
        // window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
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
            <h2>Set up payout to publish courses on Elearn</h2>
            <p className="lead text-warning">
              Elearn partners with multiple payment service to transfer earnings
              to your bank account
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
              {loading ? "Processing..." : "Payment Setup"}
            </Button>
            <p className="lead">
              You will be redirected to another page to complete onboarding
              process
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
