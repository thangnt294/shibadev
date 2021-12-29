import { useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SideNav from "../nav/SideNav";
import { Context } from "../../global/Context";
import Loading from "../../components/others/Loading";

const UserRoute = ({ children }) => {
  const router = useRouter();

  const {
    state: { pageLoading },
  } = useContext(Context);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      await axios.get("/api/current-user");
    } catch (err) {
      console.log(err);
      router.push("/login");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideNav type="user" />
        </div>
        <div className="col-md-10">{pageLoading ? <Loading /> : children}</div>
      </div>
    </div>
  );
};

export default UserRoute;
