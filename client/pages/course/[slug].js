import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { Context } from "../../context/index";
import { toast } from "react-toastify";

const SingleCourse = ({ course }) => {
  // state
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  //context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
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
      setLoading(true);
      const { data } = await axios.post(
        `/api/${paid ? "paid-enrollment" : "free-enrollment"}/${course._id}`
      );
      toast.success("Congratulations! you have successfully enrolled");
      setLoading(false);
      router.push(`/user/course/${data.slug}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again later");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        setShowModal={setShowModal}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleEnrollment={handleEnrollment}
        status={status}
      />

      <PreviewModal
        preview={preview}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
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
