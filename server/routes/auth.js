import express from "express";

const router = express.Router();

// middlewares
import { isAuthenticated } from "../middlewares";

// controllers
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", isAuthenticated, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuthenticated, changePassword);

module.exports = router;
