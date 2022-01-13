import { useEffect, useState } from "react";
import { Badge, Image, Rate, Button } from "antd";
import { truncateText } from "../../utils/helpers";
import axios from "axios";
import RatingModal from "../modal/RatingModal";
import { toast } from "react-toastify";

const CourseAbout = ({ course, handleRateCourse }) => {
  const {
    name,
    description,
    instructor,
    lessons,
    updatedAt,
    tags,
    image,
    avgRating,
  } = course;

  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    loadUserRating();
  }, []);

  const loadUserRating = async () => {
    const { data } = await axios.get(`/api/course/${course._id}/userRating`);
    if (data) {
      setInitialRating(data.rating);
      setRating(data.rating);
    }
  };

  const handleSubmit = async () => {
    setSavingRating(true);
    try {
      await handleRateCourse(rating);
      handleCloseModal(true);
      setSavingRating(false);

      toast.success("Thank you for your feedback!");
    } catch (err) {
      console.log(err);
      setSavingRating(false);
      if (err.response) toast.error(err.response.data);
    }
  };

  const handleCloseModal = (updated = false) => {
    if (updated) {
      setInitialRating(rating);
    } else {
      setRating(initialRating);
    }
    setVisible(false);
  };
  return (
    <div className="row">
      <RatingModal
        visible={visible}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        rating={rating}
        setRating={setRating}
        savingRating={savingRating}
      />
      <div className="col-md-8">
        <h1 className="font-weight-bold">{truncateText(name, 60)}</h1>
        <p className="lead">{truncateText(description, 200)}</p>
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <Badge
              count={tag}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-4 me-2"
              key={tag}
            />
          ))
        ) : (
          <Badge
            count="ShibaDev"
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-4 me-2"
          />
        )}
        <p>Created by {instructor.name}</p>
        <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
        <p>{lessons.length} lessons</p>
        <Rate allowHalf disabled value={avgRating} className="me-3" />{" "}
        <b>{avgRating}</b>
        <div className="mt-3">
          <Button onClick={() => setVisible(true)}>Rate this course</Button>
        </div>
      </div>
      <div className="col-md-4">
        <Image
          src={image ? image.Location : "/course.png"}
          alt={name}
          className="img img-fluid"
        />
      </div>
    </div>
  );
};

export default CourseAbout;
