import { likePost, unlikePost } from "../controllers/Like.controller.js";
import { Router } from "express";

const router = Router();

router.post('/posts/:id/like', likePost);
router.delete('/posts/:id/unlike', unlikePost);

export default router;