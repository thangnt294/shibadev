import { useState, useEffect, useContext } from "react";
import { Context } from "../context/index";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
import { SearchOutlined } from "@ant-design/icons";
import { Pagination } from "antd";

const Index = ({ initialCourses, initialTotal }) => {
  const [publishedCourses, setPublishedCourses] = useState([]);

  const {
    state: { courses, total, page, limit, term },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (courses === null) {
      setPublishedCourses(initialCourses);
    } else {
      setPublishedCourses(courses);
    }
  }, [courses]);

  const handleSearchCourses = async (newPage) => {
    const { data } = await axios.get(
      `api/courses?page=${newPage - 1}&limit=${limit}&term=${term}`
    );
    dispatch({
      type: "UPDATE_COURSE_LIST",
      payload: {
        courses: data.courses,
        total: data.total,
        page: newPage - 1,
        limit,
        term,
      },
    });
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        ShibaDev Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row">
          {publishedCourses.length > 0 ? (
            publishedCourses.map((course) => (
              <div key={course._id} className="col-md-4">
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <SearchOutlined className="text-muted display-1 p-4" />
                <p className="lead">
                  Sorry, we couldn't find any results. Please try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {publishedCourses.length > 0 && (
        <div className="text-center pb-4">
          <Pagination
            defaultCurrent={1}
            current={page + 1}
            pageSize={limit}
            onChange={handleSearchCourses}
            total={total === null ? initialTotal : total}
          />
        </div>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses?page=0&limit=9`);
  return {
    props: {
      initialCourses: data.courses,
      initialTotal: data.total,
    },
  };
}

export default Index;
