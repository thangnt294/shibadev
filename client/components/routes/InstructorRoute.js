import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "../others/Loading";
import SideNav from "../nav/SideNav";

const InstructorRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get("/api/current-instructor");
      if (data && data.ok) setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
      router.push("/");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <SideNav type="instructor" />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
