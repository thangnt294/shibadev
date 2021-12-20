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
  changePassword,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", requireSignin, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", requireSignin, changePassword);

module.exports = router;
