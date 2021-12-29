import { Spin } from "antd";

const SmallLoading = () => (
  <div className="d-flex justify-content-center vertical-center">
    <Spin tip="Loading..." className="mb-5" />
  </div>
);

export default SmallLoading;
