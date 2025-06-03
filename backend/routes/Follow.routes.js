import express from 'express';
import { FollowUser, UnfollowUser } from '../controllers/Follow.controller.js';

const router = express.Router();

router.get('/follow/:id', FollowUser);
router.get('/unfollow/:id', UnfollowUser);

export default router;