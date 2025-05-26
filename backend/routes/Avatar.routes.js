import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/authorization.middleware.js';
import { uploadAvatar } from '../controllers/Avatar.controller.js';
import { mediaStorage } from '../helpers/multer.helper.js';

const router = express.Router();

const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/avatar', upload.single('media'), uploadAvatar);

export default router;