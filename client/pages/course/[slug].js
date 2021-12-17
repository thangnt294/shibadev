import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { Context } from "../../context/index";
import { toast } from "react-toastify";
import { Modal } from "antd";

const SingleCourse = ({ course }) => {
  // state
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [visible, setVisible] = useState(false);

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
    // check if user is logged in
    if (!user) router.push("/login");
    // check if already enrolled
    if (status) return router.push(`/user/course/${slug}`);
    if (paid) {
      setVisible(true);
    } else {
      await enroll();
    }
  };

  const enroll = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/enroll/${course._id}`);
      setLoading(false);
      setVisible(false);
      toast.success(
        "Congratulations! you have successfully enrolled into this course."
      );
      router.push(`/user/course/${data.slug}`);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong. Please try again later.");
      console.log(err);
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

      <Modal
        title="Publish Course"
        visible={visible}
        onOk={enroll}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
      >
        <p>
          This course will cost {<b>${course.price}</b>} to enroll. Are you sure
          you want to enroll?
        </p>
      </Modal>

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
