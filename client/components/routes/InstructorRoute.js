import { useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SideNav from "../nav/SideNav";
import { Context } from "../../global/Context";
import Loading from "../../components/others/Loading";

const InstructorRoute = ({ children }) => {
  const router = useRouter();

  const {
    state: { pageLoading },
  } = useContext(Context);

  useEffect(() => {
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      await axios.get("/api/current-instructor");
    } catch (err) {
      console.log(err);
      router.push("/");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideNav type="instructor" />
        </div>
        <div className="col-md-10">{pageLoading ? <Loading /> : children}</div>
      </div>
    </div>
  );
};

export default InstructorRoute;
