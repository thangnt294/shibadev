import express from "express";

const router = express.Router();

// middlewares
import { isAuthenticated, isAdmin } from "../middlewares";

// controllers
import {
  getCurrentAdmin,
  getDailyReport,
  getAllCourses,
  deleteCourse,
} from "../controllers/admin";

router.get("/current-admin", isAuthenticated, isAdmin, getCurrentAdmin);
router.get("/admin/daily-report", isAuthenticated, isAdmin, getDailyReport);
router.get("/admin/all-courses", isAuthenticated, isAdmin, getAllCourses);
router.delete(
  "/delete-course/:courseId",
  isAuthenticated,
  isAdmin,
  deleteCourse
);

module.exports = router;
