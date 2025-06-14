import models from "../models/index.js";
import { uploadMedia } from "../helpers/multer.helper.js";

const { UserMedia, UserInfo } = models;

export default {
    async getPhotosById(id) {
        try {
            const image = await UserMedia.findAll({
                where: { user_id: id, media_type: "image" },
                attributes: ["media_id", "image_type", "created_at"],
                order: [["created_at", "DESC"]]
            });
            return { result: image };
        } catch (error) {
            return { error: { code: 500, message: "Error fetching image", detail: error.message } };
        }
    },

    async getVideosById(id) {
        try {
            const video = await UserMedia.findAll({
                where: { user_id: id, media_type: "video" },
                attributes: ["media_id", "created_at"],
                order: [["created_at", "DESC"]]
            });
            return { result: video };
        } catch (error) {
            return { error: { code: 500, message: "Error fetching video", detail: error.message } };
        }
    },

    async deleteMediaById(media_id) {
        try {
            const media = await UserMedia.findOne({ where: { media_id } });
            if (!media) return { error: { code: 404, message: "Media not found" } };

            await UserMedia.destroy({ where: { media_id } });
            return { result: { message: "Media deleted successfully" } };
        } catch (error) {
            return { error: { code: 500, message: "Error deleting media", detail: error.message } };
        }
    },

    async uploadUserImage(file, userId, imageType) {
        if (!file) {
            return {
                error: {
                    code: 400,
                    name: "NoFileError",
                    message: "Please upload a file."
                }
            };
        }

        const result = uploadMedia(file);
        if (!result) {
            return {
                error: {
                    code: 400,
                    name: "UploadFailed",
                    message: "Failed to upload file."
                }
            };
        }

        const user = await UserInfo.findByPk(userId);
        if (!user) {
            return {
                error: {
                    code: 404,
                    name: "UserNotFound",
                    message: "User not found."
                }
            };
        }

        await UserMedia.create({
            media_id: result.public_id,
            user_id: userId,
            media_type: "image",
            image_type: imageType
        });

        await UserInfo.update(
            { [imageType]: result.public_id },
            { where: { id: userId } }
        );

        return {
            result: {
                name: `Upload${imageType.charAt(0).toUpperCase() + imageType.slice(1)}Success`,
                message: result
            }
        };
    },
};
