import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";

// controllers
import { uploadAvatar, removeAvatar } from "../controllers/user";

router.post("/user/upload-avatar", requireSignin, uploadAvatar);
router.post("/user/remove-avatar", requireSignin, removeAvatar);

module.exports = router;
