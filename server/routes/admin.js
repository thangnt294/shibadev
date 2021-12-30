import express from "express";

const router = express.Router();

// middlewares
import { requireSignin, isAdmin } from "../middlewares";

// controllers
import {
  getCurrentAdmin,
  getDailyReport,
  getAllCourses,
} from "../controllers/admin";

router.get("/current-admin", requireSignin, isAdmin, getCurrentAdmin);
router.get("/admin/daily-report", requireSignin, isAdmin, getDailyReport);
router.get("/admin/all-courses", requireSignin, isAdmin, getAllCourses);

module.exports = router;
