import React, { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    if (data) {
      setCourses(data);
    }
  };

  const myStyle = { marginTop: "-15px", fontSize: "10px" };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
      {courses && courses.length > 0 ? (
        courses.map((course) => (
          <React.Fragment key={course._id}>
            <div className="pt-2 d-flex">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="ps-3 w-100">
                <div className="row">
                  <div className="col">
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <a className="mt-2 text-primary">
                        <h5 className="pt-2">{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons.length} Lessons
                    </p>

                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className="text-warning">
                        At least 5 lessons are required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className="text-success">
                        Your course is live on the marketplace
                      </p>
                    ) : (
                      <p style={myStyle} className="text-success">
                        Your course is ready to be published
                      </p>
                    )}
                  </div>
                  <div className="col-md-3 mt-3 text-center">
                    {course.published ? (
                      <Tooltip title="Published">
                        <CheckCircleOutlined className="h5 pointer text-success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unpublished">
                        <MinusCircleOutlined className="h5 pointer text-warning" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
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
    </InstructorRoute>
  );
};

export default InstructorIndex;
