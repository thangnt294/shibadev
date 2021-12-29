import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SideNav from "../nav/SideNav";
import Loading from "../others/Loading";

const UserRoute = ({ children, showNav = true }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      if (data) setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
      router.push("/login");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">{showNav && <SideNav type="user" />}</div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRoute;
