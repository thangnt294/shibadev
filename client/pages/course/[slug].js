import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import { Context } from "../../global/Context";
import { toast } from "react-toastify";
import { Modal } from "antd";
import LessonList from "../../components/others/LessonList";
import Loading from "../../components/others/Loading";

const SingleCourse = ({ course }) => {
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
  const [status, setStatus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wishListed, setWishListed] = useState(false);

  const {
    state: { user, pageLoading },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  useEffect(() => {
    if (course) checkWishListed();
  }, [course]);

  const checkWishListed = async () => {
    const { data } = await axios.get(`/api/check-wishlisted/${course._id}`);
    setWishListed(data.ok);
  };

  const checkEnrollment = async () => {
    dispatch({ type: "LOADING", payload: true });
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    dispatch({ type: "LOADING", payload: false });
    setStatus(data.status);
  };

  const router = useRouter();
  const { slug } = router.query;

  const handleEnrollment = async (e, paid) => {
    e.preventDefault();
    try {
      // check if user is logged in
      if (!user) router.push("/login");
      // check if already enrolled
      if (status) return router.push(`/user/course/${slug}`);
      if (paid) {
        setVisible(true);
      } else {
        await enroll();
      }
    } catch (err) {
      console.log(err);
      setVisible(true);
      if (err.response) toast.error(err.response.data);
    }
  };

  const enroll = async () => {
    try {
      setLoadingEnrollment(true);
      const { data } = await axios.post(`/api/enroll/${course._id}`);
      setLoadingEnrollment(false);
      setVisible(false);
      toast.success(
        "Congratulations! you have successfully enrolled into this course"
      );
      router.push(`/user/course/${data.slug}`);
    } catch (err) {
      console.log(err);
      setLoadingEnrollment(false);
      setVisible(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const addToWishList = async () => {
    try {
      await axios.post(`/api/course/${course._id}/add-to-wishlist`);
      setWishListed(true);
      toast.success("Added to wish list successfully");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  const removeFromWishList = async () => {
    try {
      await axios.post(`/api/course/${course._id}/remove-from-wishlist`);
      setWishListed(false);
      toast.success("Removed from wish list successfully");
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data);
    }
  };

  return pageLoading ? (
    <Loading />
  ) : (
    <>
      <SingleCourseJumbotron
        course={course}
        user={user}
        loadingEnrollment={loadingEnrollment}
        handleEnrollment={handleEnrollment}
        status={status}
        addToWishList={addToWishList}
        removeFromWishList={removeFromWishList}
        wishListed={wishListed}
      />

      <Modal
        title="Enroll Course"
        visible={visible}
        onOk={enroll}
        confirmLoading={loadingEnrollment}
        onCancel={() => setVisible(false)}
      >
        <p>
          This course will cost {<b>${course.price}</b>} to enroll. Are you sure
          you want to enroll?
        </p>
      </Modal>

      {course.lessons && (
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col">
              {course.lessons && <h4>{course.lessons.length} Lessons</h4>}
              <hr />
              <LessonList lessons={course.lessons} checkPreview={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
