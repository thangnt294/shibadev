import express from "express";

const router = express.Router();

// middlewares
import { isAuthenticated } from "../middlewares";

// controllers
import {
  getChatRooms,
  createChatRoom,
  getChatRoom,
} from "../controllers/chatroom";

router.get("/user/:userId/chat-rooms", isAuthenticated, getChatRooms);
router.post("/chat-room", isAuthenticated, createChatRoom);
router.get("/chat-room", isAuthenticated, getChatRoom);

module.exports = router;
