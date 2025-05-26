import models from '../models/index.js';

export const getPhotosById = async (req, res) => {
    const { id } = req.params;
    const UserMedia = models.UserMedia;
    try {
        const image = await UserMedia.findAll({
            where: { user_id: id, media_type: 'image' },
            attributes: ['media_id', 'image_type', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        return res.status(200).json({ image });
    } catch (error) {
        console.error('Error fetching image:', error);
        return res.status(500).json({ error: error, message: 'Internal server error' });
    }
}

export const getVideosById = async (req, res) => {
    const { id } = req.params;
    const UserMedia = models.UserMedia;
    try {
        const video = await UserMedia.findAll({
            where: { user_id: id, media_type: 'video' },
            attributes: ['media_id', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        
        return res.status(200).json({ video });
    } catch (error) {
        console.error('Error fetching video:', error);
        return res.status(500).json({ error: error, message: 'Internal server error' });
    }
}

export const deleteMediaById = async (req, res) => {
    const { id } = req.params;
    const UserMedia = models.UserMedia;
    try {
        const media = await UserMedia.findOne({
            where: { media_id: id }
        });

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        await UserMedia.destroy({
            where: { media_id: id }
        });

        return res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Error deleting media:', error);
        return res.status(500).json({ error: error, message: 'Internal server error' });
    }
}