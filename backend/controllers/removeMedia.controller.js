import cloudinary from '../config/cloudinaryConfig.js';

export const removeMedia = async (req, res) => {
    const id = req.params.id;
    try {
      const results = await cloudinary.uploader.destroy(`uploads/${id}`);
      if (results.result === 'not found') {
        throw new Error('Delete failed: Media not found');
      }
      return res.status(200).json({ message: 'Deleted successfully', public_id: id});
    } catch (error) {
      return res.status(400).json({ name: error.name, message: error.message });
    }
};