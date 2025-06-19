import { Router } from "express";
import { searchPosts, searchUsers } from "../controllers/Search.controller.js";

const router = Router();

router.get('/users', searchUsers);
router.get('/posts', searchPosts);

export default router;