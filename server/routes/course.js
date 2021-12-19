import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { requireSignin, isInstructor, isEnrolled } from "../middlewares";

// controllers
import {
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
  getUserCourses,
  markCompleted,
  markIncomplete,
  listCompleted,
  getTags,
  enrollCourse,
} from "../controllers/course";

router.get("/courses", getPublishedCourses);
router.get("/course-tags", getTags);

// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", getCourse);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable({ maxFileSize: 500 * 1024 * 1024 }),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

// publish unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put(
  "/course/:slug/remove-lesson/:lessonId",
  requireSignin,
  removeLesson
);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
router.post("/enroll/:courseId", requireSignin, enrollCourse);

router.get("/user-courses", requireSignin, getUserCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, getCourse);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);
router.get("/list-completed/:courseId", requireSignin, listCompleted);

module.exports = router;
