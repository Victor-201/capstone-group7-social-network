import express from 'express';
import { verifyToken } from '../middleware/authorization.middleware.js';
import routerAvatar from "./Avatar.routes.js"
import routerCover from "./Cover.routes.js"
import routerAuth from './Auth.routes.js';


const router = express.Router();


router.use('/public', routerAuth);
router.use("/user",verifyToken,routerAvatar);
router.use("/user",verifyToken,routerCover);


export default router;