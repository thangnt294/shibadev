import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { becomeInstructor } from "../controllers/instructor";

router.post("/become-instructor", requireSignin, becomeInstructor);
router.get("current-instructor", requireSignin, getCurrentInstructor);

module.exports = router;
