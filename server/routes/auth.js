import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  register,
  login,
  logout,
  getCurrentUser,
  sendTestEmail,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, getCurrentUser);
router.get("/send-email", sendTestEmail);

module.exports = router;
