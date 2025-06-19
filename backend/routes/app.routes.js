import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/authorization.middleware.js';
import routerAuth from './Auth.routes.js';
import routerUserInfo from './userInfo.routes.js';
import routerUserMedia from './userMedia.routes.js';
import routeFriend from './Friend.routes.js';
import routerFollow from './Follow.routes.js';
import routerPost from './Post.routes.js';
import routerComment from './Comment.routes.js';
import routerChat from './Chat.routes.js';
import routerMessage from './Message.routes.js';
import routerNotification from './Notification.routes.js';
import routerLike from './Like.routes.js';
import routerAdmin from './Admin.routes.js';

const router = express.Router();


router.use('/public', routerAuth);
router.use("/user",verifyToken,routerUserInfo);
router.use("/user",verifyToken,routerUserMedia);
router.use("/user",verifyToken,routeFriend);
router.use('/user', verifyToken, routerFollow);
router.use('/user', verifyToken, routerPost);
router.use('/user', verifyToken, routerComment);
router.use('/user', verifyToken, routerChat);
router.use('/user', verifyToken, routerMessage);
router.use('/user', verifyToken, routerNotification);
router.use('/user', verifyToken, routerLike);
router.use('/admin', verifyAdmin, routerAdmin);

export default router;