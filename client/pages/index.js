import { useState, useEffect, useContext } from "react";
import { Context } from "../global/Context";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination } from "antd";
import { toast } from "react-toastify";
import Loading from "../components/others/Loading";

const { Search } = Input;

const Index = () => {
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [term, setTerm] = useState("");
  const limit = 12;

  const {
    state: { pageLoading: loading },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    loadPublishedCourses();
  }, [page, term]);

  const loadPublishedCourses = async () => {
    try {
      dispatch({ type: "LOADING", payload: true });
      const { data } = await axios.get(
        `api/courses?page=${page}&limit=${limit}&term=${term}`
      );
      setPublishedCourses(data.courses);
      setTotal(data.total);
      dispatch({ type: "LOADING", payload: false });
    } catch (err) {
      console.log(err);
      dispatch({ type: "LOADING", payload: false });
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage - 1);
  };

  const handleSearch = (value) => {
    setTerm(value);
  };

  return (
    <>
      <div className="home-page-background mb-5">
        <div className="home-page-title">
          <h1 className="text-white display-1">
            ShibaDev Education Marketplace
          </h1>
          <h2 className="text-white">
            The perfect platform for learning and developing your skills
          </h2>
          <q className="lead text-white">
            Knowledge increases by sharing, not by saving.
          </q>
          <p className="text-white">- Kamari</p>
        </div>
      </div>
      <Search
        className="ms-auto me-3 mb-3"
        style={{ width: "15%" }}
        placeholder="Search for courses..."
        onSearch={handleSearch}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <div className="row">
            {publishedCourses.length > 0 ? (
              publishedCourses.map((course) => (
                <div key={course._id} className="col-md-3">
                  <CourseCard course={course} page="home" />
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
      )}
      {publishedCourses.length > 0 && (
        <div className="text-center pb-4">
          <Pagination
            defaultCurrent={1}
            current={page + 1}
            pageSize={limit}
            onChange={handleChangePage}
            total={total}
          />
        </div>
      )}
    </>
  );
};

export default Index;
