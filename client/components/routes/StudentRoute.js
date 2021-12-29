import { useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Context } from "../../global/Context";
import Loading from "../../components/others/Loading";

const StudentRoute = ({ children }) => {
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
      {pageLoading ? <Loading /> : children}
    </div>
  );
};

export default StudentRoute;
