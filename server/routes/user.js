import express from "express";

const router = express.Router();

// middlewares
import { isAuthenticated } from "../middlewares";

// controllers
import {
  uploadAvatar,
  removeAvatar,
  updateUser,
  transferBalance,
  addBalance,
} from "../controllers/user";

router.post("/user/upload-avatar", isAuthenticated, uploadAvatar);
router.post("/user/remove-avatar", isAuthenticated, removeAvatar);
router.put("/user", isAuthenticated, updateUser);
router.post("/transfer-balance", isAuthenticated, transferBalance);
router.post("/add-balance", isAuthenticated, addBalance);

module.exports = router;
