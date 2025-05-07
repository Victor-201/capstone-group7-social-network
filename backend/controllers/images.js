import cloudinary from "../config/cloudinaryConfig.js";

export const uploadImages = async (req, res) => {
    try {
        const images = req.files.map(file => file.path);
        const uploadedImages = [];

        for (let image of images) {
            const results = await cloudinary.uploader.upload(image);
            uploadedImages.push({
                url: results.secure_url,
                publicId: results.public_id,
            });
        }

        return res.status(200).json({
            message: 'Images uploaded successfully',
            data: uploadedImages,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(400).json({ 
            name: error.name,
            message: error.message 
        });
    }
};
