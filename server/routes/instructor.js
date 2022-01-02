import express from "express";

const router = express.Router();

// middleware
import { isAuthenticated } from "../middlewares";

// controllers
import {
  becomeInstructor,
  getCurrentInstructor,
  getInstructorCourses,
  countStudent,
} from "../controllers/instructor";

router.post("/become-instructor", isAuthenticated, becomeInstructor);
router.get("/current-instructor", isAuthenticated, getCurrentInstructor);
router.get("/instructor-courses", isAuthenticated, getInstructorCourses);

router.get(
  "/instructor/student-count/:courseId",
  isAuthenticated,
  countStudent
);

module.exports = router;
