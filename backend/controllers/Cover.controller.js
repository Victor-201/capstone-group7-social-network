import { uploadMedia, removeMedia } from "../helpers/multer.helper.js";
import models from "../models/index.js";

const { UserInfo, UserMedia } = models;

export const uploadCover = async (req, res) => {
  try {
    const result  = uploadMedia(req.file);
    const id = req.user.id;
    if (!result) {
      return res.status(400).json({
        name: "NoFileError",
        message: "Please upload a file."
      });
    }
    const user = await UserInfo.findOne({ where: { id: id } });
    if(!user){
        return res.status(401).json({
            name: "UserNotFound",
            message: "Please try again"
        })
    }
    await UserMedia.create({
        media_id: result.public_id,
        user_id: id,
        media_type: "image",
        image_type: "cover"
    })
    await UserInfo.update(
      { cover: result.public_id },  
      { where: { id: id } }
    );
    return res.status(200).json({
      name: "UploadCoverSuccess",
      message: result
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message
    });
  }
};