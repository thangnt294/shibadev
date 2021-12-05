import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { currencyFormatter } from "../../utils/helpers";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSetting = async () => {
    console.log("handle payout setting");
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue report <DollarOutlined className="float-right" />
            </h2>
            <small>Some text about payments</small>
            <hr />
            <h4>
              Balance{" "}
              <span className="float-right">
                {currencyFormatter({ amount: balance, currency: "usd" })}
              </span>
            </h4>
            <small>For 48 hours</small>
            <hr />
            <h4>
              Payout{" "}
              <SettingOutlined
                className="float-right pointer"
                onClick={handlePayoutSetting}
              />
            </h4>
            <small>Update your account details or view previous payouts</small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;