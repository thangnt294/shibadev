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
} from "../controllers/user";

router.post("/user/upload-avatar", isAuthenticated, uploadAvatar);
router.post("/user/remove-avatar", isAuthenticated, removeAvatar);
router.put("/user", isAuthenticated, updateUser);
router.post("/transfer-balance", isAuthenticated, transferBalance);

module.exports = router;
