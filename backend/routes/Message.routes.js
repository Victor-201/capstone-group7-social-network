import { getMessagesByChatId, 
    sendMessage, markMessageAsRead, 
    countUnreadMessages, 
    getUserInfoInChat } 
    from "../controllers/Message.controller.js";
import express from "express";
import { sanitizeBody } from "../middleware/sanitize.middleware.js";

const router = express.Router();
router.get('/chats/:chat_id/messages', getMessagesByChatId);
router.post('/chats/:chat_id/messages', sanitizeBody, sendMessage);
router.put('/chats/:chat_id/read', markMessageAsRead);
router.get('/chat/:chat_id/unread-count', countUnreadMessages);
router.get('/chat/:chat_id/users-in-chat', getUserInfoInChat);

export default router;