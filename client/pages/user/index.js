import { useState, useContext, useEffect } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourse = async () => {
    const { data } = await axios.get("/api/user-courses");
    setCourses(data);
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">User dashboard</h1>
      <pre>{JSON.stringify(courses, null, 4)}</pre>
    </UserRoute>
  );
};

export default UserIndex;
