import { getMessagesByChatId, sendMessage, markMessageAsRead } from "../controllers/Message.controller.js";
import express from "express";

const router = express.Router();
router.get('/chats/:chat_id/messages', getMessagesByChatId);
router.post('/chats/:chat_id/messages', sendMessage);
router.put('/messages/:message_id/read', markMessageAsRead)

export default router;