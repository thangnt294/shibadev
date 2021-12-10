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
  forgotPassword,
  resetPassword,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", requireSignin, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
