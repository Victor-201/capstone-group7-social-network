import express from 'express';
import { 
  FollowUser, 
  UnfollowUser, 
  getFollowers, 
  getFollowing, 
  getFollowStatus 
} from '../controllers/Follow.controller.js';

const router = express.Router();

router.get('/follow/:id', FollowUser);
router.get('/unfollow/:id', UnfollowUser);
router.get('/followers', getFollowers);
router.get('/following', getFollowing);
router.get('/status/:id', getFollowStatus);

export default router;