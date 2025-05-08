export const uploadMedia = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
      }
      const uploadedMedia = [];
      for (const file of req.files) {
        const fileName = file.filename.split('/')[1];
        const media = {
          url: file.path,
          public_id: fileName,
        };
        uploadedMedia.push(media);
      }
  
      return res.status(200).json({
        message: 'Uploaded successfully',
        data: uploadedMedia,
      });
    } catch (error) {
      console.error('Error uploading:', error);
      res.status(400).json({
        name: error.name,
        message: error.message,
      });
    }
};