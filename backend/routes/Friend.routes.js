import { sendFriendRequest, respondToFriendRequest } from "../controllers/Friend.controller.js";
import express from 'express';

const router = express.Router();
router.post('/friends/request', sendFriendRequest);
router.put('/friends/respond', respondToFriendRequest);

export default router;