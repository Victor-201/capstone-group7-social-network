import { Router } from "express";
import { createComment, replyToComment, deleteComment } from "../controllers/Comment.controller.js";

const router = Router();

router.post("/posts/:id/comments", createComment);
router.post("/comments/:id/reply", replyToComment);
router.delete("/comments/:id", deleteComment);

export default router;