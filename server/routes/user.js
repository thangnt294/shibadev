import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";

// controllers
import { uploadAvatar, removeAvatar, updateUser } from "../controllers/user";

router.post("/user/upload-avatar", requireSignin, uploadAvatar);
router.post("/user/remove-avatar", requireSignin, removeAvatar);
router.put("/user", requireSignin, updateUser);

module.exports = router;
