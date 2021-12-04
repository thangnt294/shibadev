import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { requireSignin, isInstructor, isEnrolled } from "../middlewares";

// controllers
import {
  uploadImage,
  removeImage,
  create,
  update,
  getCourse,
  uploadVideo,
  removeVideo,
  addLesson,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  getPublishedCourses,
  checkEnrollment,
  freeEnroll,
  paidEnroll,
  getUserCourses,
  markCompleted,
  markIncomplete,
  listCompleted,
} from "../controllers/course";

router.get("/courses", getPublishedCourses);

// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", getCourse);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

// publish unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
router.post("/free-enrollment/:courseId", requireSignin, freeEnroll);
router.post("paid-enrollment/:courseId", requireSignin, paidEnroll);

router.get("/user-courses", requireSignin, getUserCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, getCourse);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);
router.get("/list-completed/:courseId", requireSignin, listCompleted);

module.exports = router;
