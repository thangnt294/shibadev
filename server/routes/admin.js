import express from "express";

const router = express.Router();

// middlewares
import { requireSignin, isAdmin } from "../middlewares";

// controllers
import { getCurrentAdmin, getDailyReport } from "../controllers/admin";

router.get("/current-admin", requireSignin, isAdmin, getCurrentAdmin);
router.get("/daily-report", requireSignin, isAdmin, getDailyReport);

module.exports = router;
