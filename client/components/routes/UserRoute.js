import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const UserRoute = ({ children }) => {
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
        <>{children}</>
      )}
    </>
  );
};

export default UserRoute;
