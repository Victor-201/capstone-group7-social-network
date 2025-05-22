import express from 'express';
import multer from 'multer';
import { uploadCover } from '../controllers/Cover.controller.js';
import { mediaStorage } from '../helpers/multer.helper.js';

const router = express.Router();

const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/cover', upload.single('media'), uploadCover);

export default router;