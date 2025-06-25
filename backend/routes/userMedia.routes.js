import { getPhotosById, getVideosById, deleteMediaById, uploadAvatar, uploadCover, getAllIamgesById } from "../controllers/userMedia.controller.js";
import express from "express";
import multer from "multer";
import { mediaStorage } from "../helpers/multer.helper.js";
const upload = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });

const router = express.Router();
router.get("/photos/:id", getPhotosById);
router.get("/videos/:id", getVideosById);
router.delete("/media/:id", deleteMediaById);
router.post("/avatar", upload.single('media'), uploadAvatar);
router.post("/cover", upload.single('media'), uploadCover);
router.get('/images', getAllIamgesById);
export default router;