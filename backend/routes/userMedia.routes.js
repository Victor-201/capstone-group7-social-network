import { getPhotosById, getVideosById, deleteMediaById } from "../controllers/userMedia.controller.js";
import express from "express";

const router = express.Router();
router.get("/photos/:id", getPhotosById);
router.get("/videos/:id", getVideosById);
router.delete("/media/:id", deleteMediaById);
export default router;