import { Router } from "express";
import { createComment, replyToComment, deleteComment } from "../controllers/Comment.controller.js";
import { sanitizeBody } from '../middleware/sanitize.middleware.js';

const router = Router();

router.post("/posts/:id/comments", sanitizeBody, createComment);
router.post("/comments/:id/reply", sanitizeBody, replyToComment);
router.delete("/comments/:id", deleteComment);

export default router;