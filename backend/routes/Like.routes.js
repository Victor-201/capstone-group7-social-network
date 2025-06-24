import { likeOrUnlike, postLiked } from "../controllers/Like.controller.js";
import { Router } from "express";

const router = Router();

router.get('/liked', postLiked);
router.post('/posts/:id/toggle-like/:isLike', likeOrUnlike)

export default router;