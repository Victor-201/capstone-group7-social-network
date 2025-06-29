import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/authorization.middleware.js';
import authLimiter from '../middleware/limiter.middleware.js';
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
import routerSearch from './Search.routes.js';

const router = express.Router();


// Đăng nhập / đăng ký không cần token
router.use('/public', authLimiter, routerAuth);

// Admin
router.use('/admin', verifyAdmin, routerAdmin);

// Search

// Group toàn bộ /user vào 1 verifyToken
router.use('/user', verifyToken);

// Gắn router con sau khi đã verifyToken
router.use('/user', routerUserInfo);
router.use('/user', routerUserMedia);
router.use('/user', routeFriend);
router.use('/user', routerFollow);
router.use('/user', routerPost);
router.use('/user', routerComment);
router.use('/user', routerChat);
router.use('/user', routerMessage);
router.use('/user', routerNotification);
router.use('/user', routerLike);
router.use('/user/search', verifyToken, routerSearch);


export default router;