import express from 'express';
import { verifyToken } from '../middleware/authorization.middleware.js';
import routerUpload from './uploadMedia.routes.js';
import routerRemove from './removeMedia.routes.js';
import routerAuth from './Auth.routes.js';


const router = express.Router();

router.use('/media', verifyToken, routerUpload);
router.use('/media', verifyToken, routerRemove);
router.use('/auth', routerAuth);

export default router;