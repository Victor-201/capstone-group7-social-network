import { getUserInfo, updateUserInfo, getUserInfoById } from "../controllers/userInfo.controller.js";
import express from "express";

const router = express.Router();

router.get("/profile", getUserInfo);
router.put("/profile", updateUserInfo);
router.get("/profile/:id", getUserInfoById);

export default router;