import express from 'express';
import { verifyToken } from '../middleware/authorization.middleware.js';
import routerAvatar from "./Avatar.routes.js"
import routerCover from "./Cover.routes.js"
import routerAuth from './Auth.routes.js';
import routerUserInfo from './userInfo.routes.js';
import routerUserMedia from './userMedia.routes.js';
import routeFriend from './Friend.routes.js';
import routerFollow from './Follow.routes.js';
import routerPost from './Post.routes.js';

const router = express.Router();


router.use('/public', routerAuth);
router.use("/user",verifyToken,routerAvatar);
router.use("/user",verifyToken,routerCover);
router.use("/user",verifyToken,routerUserInfo);
router.use("/user",verifyToken,routerUserMedia);
router.use("/user",verifyToken,routeFriend);
router.use('/user', verifyToken, routerFollow);
router.use('/user', verifyToken, routerPost);


export default router;