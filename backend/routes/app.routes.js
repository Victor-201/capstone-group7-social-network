import express from 'express';
import routerUpload from './uploadMedia.routes.js';
import routerRemove from './removeMedia.routes.js';

const router = express.Router();

router.use('/media', routerUpload);
router.use('/media', routerRemove);

export default router;