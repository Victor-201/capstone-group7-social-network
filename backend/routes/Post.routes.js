import express from 'express';
import multer from 'multer';
import { mediaStorage } from '../helpers/multer.helper.js';
import { CreatePost, GetPosts, PostDetail, editPost, deletePost, sharePost } from '../controllers/Post.controller.js';

const router = express.Router();

const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });
router.post('/posts',upload.array('media'), CreatePost);
router.get('/posts/feed', GetPosts);
router.get('/posts/:id', PostDetail);
router.put('/posts/:id', editPost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/share', sharePost);

export default router;