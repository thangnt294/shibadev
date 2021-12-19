import { Spin } from "antd";

const Loading = () => (
  <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
    <Spin tip="Loading..." className="align-self-center mb-5" />
  </div>
);

export default Loading;
