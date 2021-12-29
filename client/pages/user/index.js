import { useState, useEffect, useContext } from "react";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import CourseCard from "../../components/cards/CourseCard";
import { Context } from "../../global/Context";
import { SolutionOutlined } from "@ant-design/icons";
import Link from "next/link";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);

  const { dispatch } = useContext(Context);

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
      if (err.response) toast.error(err.response.data);
    }
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">User dashboard</h1>
      {courses.length > 0 ? (
        <>
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
          <div className="text-center pt-4 pb-4">
            <Pagination
              defaultCurrent={1}
              current={page + 1}
              pageSize={8}
              onChange={(page) => setPage(page - 1)}
              total={total}
            />
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5">
          <div className="text-center p-5">
            <SolutionOutlined className="text-muted display-1 p-4" />
            <p className="lead">
              You haven't enrolled in any course yet.
              <Link href="/" className="lead">
                <a> Browse the courses.</a>
              </Link>
            </p>
          </div>
        </div>
      )}
    </UserRoute>
  );
};

export default UserIndex;
