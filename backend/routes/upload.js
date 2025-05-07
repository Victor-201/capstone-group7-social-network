import express from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/images.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('image'), uploadImages);

export default router;
