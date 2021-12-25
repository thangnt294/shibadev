import { useState, useEffect, useContext } from "react";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import CourseCard from "../../components/cards/CourseCard";
import { Context } from "../../global/Context";
import Loading from "../../components/others/Loading";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);

  const {
    state: { loading },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async () => {
    try {
      dispatch({ type: "LOADING", payload: true });
      const { data } = await axios.get(
        `/api/user-courses?page=${page}&&limit=8`
      );
      setCourses(data.courses);
      setTotal(data.total);
      dispatch({ type: "LOADING", payload: false });
    } catch (err) {
      console.log(err);
      dispatch({ type: "STOP_LOADING", payload: false });
      toast.error(err.response.data);
    }
  };

  return (
    <UserRoute>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="jumbotron text-center square">User dashboard</h1>
          <div className="container-fluid">
            <div className="row">
              {courses &&
                courses.map((course) => (
                  <div key={course._id} className="col-md-3">
                    <CourseCard course={course} page="user" />
                  </div>
                ))}
            </div>
          </div>
          {courses.length > 0 && (
            <div className="text-center pt-4 pb-4">
              <Pagination
                defaultCurrent={1}
                current={page + 1}
                pageSize={8}
                onChange={(page) => setPage(page - 1)}
                total={total}
              />
            </div>
          )}
        </>
      )}
    </UserRoute>
  );
};

export default UserIndex;
