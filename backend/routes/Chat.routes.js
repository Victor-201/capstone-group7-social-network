import { Router } from 'express';
import { createChat, getChatList } from '../controllers/Chat.controller.js';

const router = Router();

router.post('/chats', createChat);
router.get('/chats', getChatList);

export default router;