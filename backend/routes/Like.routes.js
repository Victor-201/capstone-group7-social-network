import { likePost, unlikePost, likeOrUnlike } from "../controllers/Like.controller.js";
import { Router } from "express";

const router = Router();

// router.post('/posts/:id/like', likePost);
// router.delete('/posts/:id/unlike', unlikePost);
router.post('/posts/:id/toggle-like', likeOrUnlike)

export default router;