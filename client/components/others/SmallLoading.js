import { Spin } from "antd";

const SmallLoading = () => (
  <div
    className="d-flex justify-content-center"
    style={{ position: "relative", top: "50%", transform: "translateY(-50%)" }}
  >
    <Spin tip="Loading..." className="mb-5" />
  </div>
);

export default SmallLoading;
