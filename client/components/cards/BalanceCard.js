import { DollarCircleOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Tooltip, Popconfirm } from "antd";
import { currencyFormatter } from "../../utils/helpers";

const BalanceCard = ({ balance, handleTransferBalance }) => {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex pb-3">
          <h4>Balance</h4>
          <div className="col">
            <DollarCircleOutlined className="float-end h3 text-secondary" />
          </div>
        </div>
        <div className="d-flex">
          <h5>
            {currencyFormatter({
              amount: balance,
              currency: "usd",
            })}
          </h5>
          <div className="col">
            <Tooltip title="Transfer balance">
              <Popconfirm
                title="ALl your balance will be transferred to your bank account. Proceed?"
                onConfirm={handleTransferBalance}
                okText="OK"
                cancelText="Cancel"
              >
                <CreditCardOutlined className="float-end lead text-secondary pointer clickable-icon credit-card-icon" />
              </Popconfirm>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
