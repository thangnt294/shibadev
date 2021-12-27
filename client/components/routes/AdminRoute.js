import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "../others/Loading";
import AdminNav from "../nav/AdminNav";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/current-admin");
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
              <AdminNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRoute;
