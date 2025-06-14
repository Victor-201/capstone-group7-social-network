import {    sendFriendRequest, 
            respondToFriendRequest, 
            getMutualFriends,
            getFriendsList,
            deleteFriend
        } 
from "../controllers/Friend.controller.js";
import { validateEnum } from "../middleware/validateEnum.middleware.js";
import express from 'express';

const router = express.Router();
router.post('/friends/request', sendFriendRequest);
router.put('/friends/respond', validateEnum('Friend'), respondToFriendRequest);
router.get('/friends/mutual/:friend_id', getMutualFriends);
router.get('/friends', getFriendsList);
router.delete('/friends/:friend_id', deleteFriend);

export default router;