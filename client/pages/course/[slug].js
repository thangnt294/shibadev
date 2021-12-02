import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const SingleCourse = ({ course }) => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <div className="container-fluid">
        <div className="row">{course}</div>
      </div>
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
