import { getMessagesByChatId, sendMessage, markMessageAsRead, countUnreadMessages } from "../controllers/Message.controller.js";
import express from "express";

const router = express.Router();
router.get('/chats/:chat_id/messages', getMessagesByChatId);
router.post('/chats/:chat_id/messages', sendMessage);
router.put('/chats/:chat_id/read', markMessageAsRead);
router.get('/chat/:chat_id/unread-count', countUnreadMessages);

export default router;