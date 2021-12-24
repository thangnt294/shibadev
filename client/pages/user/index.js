import { useState, useEffect } from "react";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { PlayCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import CourseCard from "../../components/cards/CourseCard";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data);
    }
  };

  return (
    <UserRoute>
      {!loading && (
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
        </>
      )}
    </UserRoute>
  );
};

export default UserIndex;
