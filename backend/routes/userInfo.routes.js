import { getUserInfo, updateUserInfo, getUserInfoById } from "../controllers/userInfo.controller.js";
import express from "express";

const router = express.Router();

router.get("/info", getUserInfo);
router.put("/info", updateUserInfo);
router.get("/info/:id", getUserInfoById);

export default router;