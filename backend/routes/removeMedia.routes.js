import express from 'express';
import { removeMedia } from '../controllers/removeMedia.controller.js';

const router = express.Router();

router.delete('/remove/:id',removeMedia);

export default router;