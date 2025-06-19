import { Router } from "express";
import { getAllUsers, changeUserStatus, getAllPosts, deletePost, getSystemStats } from "../controllers/Admin.controller.js";

const router = Router();

router.get('/users', getAllUsers);
router.put('/users/:id/status', changeUserStatus);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);
router.get('/system-stats', getSystemStats);

export default router;