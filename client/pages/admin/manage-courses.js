import { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "../../components/routes/AdminRoute";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [term, setTerm] = useState(".*");

  useEffect(() => {
    fetchCourses();
  }, [page, term]);

  const fetchCourses = async () => {
    const { data } = await axios.get(
      `/api/admin/all-courses?page=${page}&limit=12&term=${term}`
    );

    console.log("DATA", data);

    setCourses(data.courses);
    setTotal(data.total);
  };

  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Manage Courses</h1>
    </AdminRoute>
  );
};

export default ManageCourses;
