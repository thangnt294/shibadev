import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";

// controllers
import { getCurrentAdmin } from "../controllers/admin";

router.get("/current-admin", requireSignin, getCurrentAdmin);

module.exports = router;
