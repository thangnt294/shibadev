import express from "express";

const router = express.Router();

// middlewares
import { isAuthenticated } from "../middlewares";

// controllers
import { getChatRooms, createChatroom } from "../controllers/chatroom";

router.get("/chat-rooms", isAuthenticated, getChatRooms);

module.exports = router;
