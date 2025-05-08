import express from 'express';
import multer from 'multer';
import { uploadMedia } from '../controllers/uploadMedia.controller.js';
import { mediaStorage } from '../middleware/multer.middleware.js';

const router = express.Router();

const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/upload', upload.array('media'), uploadMedia);

export default router;
