import express from 'express';
import routerImages from './upload.js';

const router = express.Router();

router.use('/images', routerImages);

export default router;