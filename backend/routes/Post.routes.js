import express from 'express';
import multer from 'multer';
import { validateEnum } from '../middleware/validateEnum.middleware.js';
import { mediaStorage } from '../helpers/multer.helper.js';
import { CreatePost, GetPosts, PostDetail, editPost, deletePost, sharePost, getRelatedPosts } from '../controllers/Post.controller.js';

const router = express.Router();

const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });
router.post('/post',upload.array('media'), validateEnum('Post'), CreatePost);
router.get('/posts/feed', getRelatedPosts);
router.get('/posts', GetPosts);
router.get('/posts/:id', PostDetail);
router.put('/posts/:id', validateEnum('Post'), editPost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/share', sharePost);

export default router;