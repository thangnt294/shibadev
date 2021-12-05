import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const StudentRoute = ({ children }) => {
  // state
  const [hidden, setHidden] = useState(true);
  // router
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      setHidden(!data.ok);
    } catch (err) {
      console.log(err);
      setHidden(true);
      router.push("/login");
    }
  };

  return (
    <>
      {hidden ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <div className="container-fluid">{children}</div>
      )}
    </>
  );
};

export default StudentRoute;