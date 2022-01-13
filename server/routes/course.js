import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { isAuthenticated, isInstructor, isEnrolled } from "../middlewares";

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
  comment,
  rateCourse,
  getUserRating,
} from "../controllers/course";

router.get("/courses", getPublishedCourses);
router.get("/course-tags", getTags);

// course
router.post("/course", isAuthenticated, isInstructor, create);
router.put("/course/:slug", isAuthenticated, update);
router.get("/course/:slug", getCourse);
router.post(
  "/course/video-upload/:instructorId",
  isAuthenticated,
  formidable({ maxFileSize: 500 * 1024 * 1024 }),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", isAuthenticated, removeVideo);

// publish unpublish
router.put("/course/publish/:courseId", isAuthenticated, publishCourse);
router.put("/course/unpublish/:courseId", isAuthenticated, unpublishCourse);

router.post("/course/lesson/:slug/:instructorId", isAuthenticated, addLesson);
router.put("/course/lesson/:slug/:instructorId", isAuthenticated, updateLesson);
router.put(
  "/course/:slug/remove-lesson/:lessonId",
  isAuthenticated,
  removeLesson
);

router.get("/check-enrollment/:courseId", isAuthenticated, checkEnrollment);

// enrollment
router.post("/enroll/:courseId", isAuthenticated, enrollCourse);

router.get("/user-courses", isAuthenticated, getUserCourses);
router.get("/user/course/:slug", isAuthenticated, isEnrolled, getCourse);

// mark completed
router.post("/mark-completed", isAuthenticated, markCompleted);
router.post("/mark-incomplete", isAuthenticated, markIncomplete);
router.get("/list-completed/:courseId", isAuthenticated, listCompleted);

router.post("/course/:courseId/comment", isAuthenticated, comment);
router.post("/course/:courseId/rate", isAuthenticated, rateCourse);
router.get("/course/:courseId/userRating", isAuthenticated, getUserRating);

module.exports = router;
