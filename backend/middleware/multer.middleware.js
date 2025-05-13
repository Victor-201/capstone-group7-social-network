import cloudinary from "../configs/cloudinary.config.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";

export const mediaStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'uploads',
      resource_type: 'auto',
      public_id: (req, file) => {
        return uuidv4();
      },
    },
});