import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";

// controllers
import {
  uploadAvatar,
  removeAvatar,
  updateUser,
  transferBalance,
} from "../controllers/user";

router.post("/user/upload-avatar", requireSignin, uploadAvatar);
router.post("/user/remove-avatar", requireSignin, removeAvatar);
router.put("/user", requireSignin, updateUser);
router.post("/transfer-balance", requireSignin, transferBalance);

module.exports = router;
