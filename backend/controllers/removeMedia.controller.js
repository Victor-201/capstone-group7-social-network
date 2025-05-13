import cloudinary from '../configs/cloudinary.config.js';

export const removeMedia = async (req, res) => {
    const id = req.params.id;
    try {
      let results = await cloudinary.uploader.destroy(`uploads/${id}`,{
        resource_type: 'image',
      });
      if (results.result === 'not found') {
        results = await cloudinary.uploader.destroy(`uploads/${id}`,{
          resource_type: 'video'
        });
      }
      if (results.result !== 'ok') {
        throw new Error('Media not found');
      }
      return res.status(200).json({ message: 'Deleted successfully', public_id: id});
    } catch (error) {
      return res.status(400).json({ name: error.name, message: error.message });
    }
};