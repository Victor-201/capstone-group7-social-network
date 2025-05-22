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

export const uploadMedia = (file) => {
  if (!file || !file.path || !file.filename) {
    throw new Error('Invalid file object');
  }

  const public_id = file.filename.split('/')[1];
  return {
    url: file.path,
    public_id
  };
};

export const uploadMultipleMedia = (files) => {
  if (!Array.isArray(files)) {
    throw new Error('Invalid files array');
  }

  return files.map(file => ({
    url: file.path,
    public_id: file.filename.split('/')[1]
  }));
};

export const removeMedia = async (req, res) => {
  let result = await cloudinary.uploader.destroy(`uploads/${publicId}`, {
  resource_type: 'image',
  });
  if (result.result === 'not found') {
    result = await cloudinary.uploader.destroy(`uploads/${publicId}`, {
      resource_type: 'video',
    });
  }
  if (result.result !== 'ok') {
    throw new Error('Media not found');
  }
  return result;
};