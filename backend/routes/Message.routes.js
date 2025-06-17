import { getMessagesByChatId, sendMessage } from "../controllers/Message.controller.js";
import express from "express";

const router = express.Router();
router.get('/chats/:chat_id/messages', getMessagesByChatId);
router.post('/chats/:chat_id/messages', sendMessage);

export default router;