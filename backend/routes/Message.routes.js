import { Router } from 'express';
import { sendMessage, getMessagesByChat } from '../controllers/Message.controller.js';

const router = Router();

router.post('/chats/:id/messages', sendMessage);
router.get('/chats/:id/messages', getMessagesByChat);

export default router;