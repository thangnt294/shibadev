import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AdminRoute from "../../components/routes/AdminRoute";
import { Table, Tag, Badge, Modal, Rate } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import ViewLessonModal from "../../components/modal/ViewLessonModal";
import { currencyFormatter, truncateText } from "../../utils/helpers";
import { Context } from "../../global/Context";
import { toast } from "react-toastify";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [term, setTerm] = useState(".*");
  const [viewLessonModalVisible, setViewLessonModalVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);

  const { dispatch } = useContext(Context);

  useEffect(() => {
    fetchCourses();
  }, [page, term]);

  const fetchCourses = async () => {
    dispatch({ type: "LOADING", payload: true });
    const { data } = await axios.get(
      `/api/admin/all-courses?page=${page}&limit=${pageSize}&term=${term}`
    );

    setCourses(data.courses);
    setTotal(data.total);
    dispatch({ type: "LOADING", payload: false });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Instructor",
      dataIndex: ["instructor", "name"],
    },
    { title: "Lessons", dataIndex: ["lessons", "length"], responsive: ["md"] },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (tags) => (
        <span>
          {tags.map((tag) => (
            <Tag color="geekblue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
      responsive: ["md"],
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <span>{currencyFormatter({ amount: price, currency: "usd" })}</span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "avgRating",
      render: (avgRating) => <Rate allowHalf disabled value={avgRating} />,
      responsive: ["md"],
    },
    {
      title: "Published",
      dataIndex: "published",
      render: (published) => (
        <span>
          <Badge status={published ? "success" : "error"} />
          {published ? "Yes" : "No"}
        </span>
      ),
      responsive: ["md"],
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, record) => (
        // <Popconfirm
        //   title="Are you sure you want to delete this course?"
        //   onConfirm={() => handleDeleteCourse(record._id.toString())}
        // >
        <span
          onClick={() => {
            setCurrentCourseId(record._id.toString());
            setConfirmModalVisible(true);
          }}
          className="pointer text-primary"
        >
          Delete
        </span>
        // </Popconfirm>
      ),
    },
  ];

  const expandedRowRender = (lessons) => {
    const columns = [
      { title: "Title", dataIndex: "title" },
      { title: "Content", dataIndex: "content" },
      {
        title: "Video",
        dataIndex: "video",
        render: (video) => (
          <span>
            <Badge status={video ? "success" : "error"} />
            {video ? "Yes" : "No"}
          </span>
        ),
        responsive: ["md"],
      },
      {
        title: "Action",
        dataIndex: "",
        render: (_, record) => (
          <span
            className="pointer text-primary"
            onClick={() => handleOpenModal(record)}
          >
            View
          </span>
        ),
      },
    ];

    return <Table columns={columns} dataSource={lessons} pagination={false} />;
  };

  const handleOpenModal = (lesson) => {
    setCurrentLesson(lesson);
    setViewLessonModalVisible(true);
  };

  const handleCloseModal = () => {
    setViewLessonModalVisible(false);
    setViewLessonModalVisible(null);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalVisible(false);
    setCurrentCourseId(null);
  };

  const handleDeleteCourse = async () => {
    setDeletingCourse(true);
    try {
      await axios.delete(`/api/delete-course/${currentCourseId}`);
      const updatedCourses = courses.filter(
        (course) => course._id.toString() !== currentCourseId
      );
      setCourses(updatedCourses);
      handleCloseConfirmModal();
      toast.success("Course has been deleted");
    } catch (err) {
      console.log(err);
      handleCloseConfirmModal();
      if (err.response) toast.error(err.response.data);
    }
  };

  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Manage Courses</h1>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) =>
            expandedRowRender(
              record.lessons.map((lesson, index) => ({
                ...lesson,
                key: index,
                title: truncateText(lesson.title, 30),
                content: truncateText(lesson.content, 50),
              }))
            ),
          rowExpandable: (record) => record.lessons.length > 0,
        }}
        dataSource={courses.map((course, index) => ({
          ...course,
          key: index,
          name: truncateText(course.name, 30),
          description: truncateText(course.description, 50),
        }))}
        pagination={{
          total: total,
          current: page + 1,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />
      <ViewLessonModal
        lesson={currentLesson}
        handleCloseModal={handleCloseModal}
        visible={viewLessonModalVisible}
      />
      <Modal
        title={
          <>
            <WarningOutlined className="text-warning lead me-2" />{" "}
            <span className="lead">Delete Course</span>
          </>
        }
        visible={confirmModalVisible}
        onOk={handleDeleteCourse}
        confirmLoading={deletingCourse}
        onCancel={handleCloseConfirmModal}
      >
        <p>
          Once you delete this course, your balance will automatically be
          deducted to refund all students who have enrolled.
        </p>
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </AdminRoute>
  );
};

export default ManageCourses;
