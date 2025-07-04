import {    sendFriendRequest,
            respondToFriendRequest,
            getMutualFriends,
            getFriendsList,
            deleteFriend,
            getSentRequests,
            getReceivedRequests,
            suggestFriends,
            getFriendshipStatus
        }
from "../controllers/Friend.controller.js";
import { validateEnum } from "../middleware/validateEnum.middleware.js";
import express from 'express';

const router = express.Router();
router.post('/friends/request', sendFriendRequest);
router.put('/friends/respond', validateEnum('Friend'), respondToFriendRequest);
router.get('/friends/mutual/:friend_id', getMutualFriends);
router.get('/friends', getFriendsList);
router.get('/friends/sent-requests', getSentRequests);
router.get('/friends/received-requests', getReceivedRequests);
router.delete('/friends/:friend_id', deleteFriend);
router.get('/friends/suggest', suggestFriends);
router.get('/status/:friend_id', getFriendshipStatus);

export default router;