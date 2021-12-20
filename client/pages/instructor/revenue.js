import { useState, useEffect } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import { DollarOutlined, RightCircleOutlined } from "@ant-design/icons";
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
    alert("Bank transfer succeeded!");
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue report <DollarOutlined className="float-end" />
            </h2>
            <small>This shows you how much you've earned on Elearn.</small>
            <hr />
            <h4>
              Balance{" "}
              <span className="float-end">
                {currencyFormatter({ amount: balance, currency: "usd" })}
              </span>
            </h4>
            <small>This is your current balance.</small>
            <hr />
            <h4>
              Payout{" "}
              <RightCircleOutlined
                className="float-end pointer"
                onClick={handlePayoutSetting}
              />
            </h4>
            <small>
              Click here to transfer your balance to your bank account
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
