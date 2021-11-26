import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  becomeInstructor,
  getCurrentInstructor,
  getInstructorCourses,
} from "../controllers/instructor";

router.post("/become-instructor", requireSignin, becomeInstructor);
router.get("/current-instructor", requireSignin, getCurrentInstructor);
router.get("/instructor-courses", requireSignin, getInstructorCourses);

module.exports = router;
