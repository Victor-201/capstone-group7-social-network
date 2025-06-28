import { getUserInfo, updateUserInfo, getUserInfoById, updateProfile, updateProfileVisibility, getUserInfoByUserName } from "../controllers/userInfo.controller.js";
import express from "express";

const router = express.Router();

router.get("/info", getUserInfo);
router.put("/info", updateUserInfo);
router.get("/info/:id", getUserInfoById);
router.put('/profile', updateProfile);
router.put('/profile/visibility', updateProfileVisibility);
router.get('/info/username/:user_name', getUserInfoByUserName);


export default router;