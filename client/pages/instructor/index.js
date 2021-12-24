import React, { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Pagination } from "antd";
import Link from "next/link";
import Loading from "../../components/others/Loading";
import { SolutionOutlined } from "@ant-design/icons";
import CourseCard from "../../components/cards/CourseCard";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `/api/instructor-courses?page=${page}&limit=8`
    );
    if (data) {
      setCourses(data.courses);
      setTotal(data.total);
    }
    setLoading(false);
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <div className="row">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="col-md-3">
                  <CourseCard course={course} page="instructor" />
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center p-5">
                <div className="text-center p-5">
                  <SolutionOutlined className="text-muted display-1 p-4" />
                  <p className="lead">
                    You haven't created any course yet.
                    <Link href="/instructor/course/create" className="lead">
                      <a> Create one.</a>
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {courses.length > 0 && (
        <div className="text-center pt-4 pb-4">
          <Pagination
            defaultCurrent={1}
            current={page + 1}
            pageSize={9}
            onChange={(page) => setPage(page - 1)}
            total={total}
          />
        </div>
      )}
    </InstructorRoute>
  );
};

export default InstructorIndex;
