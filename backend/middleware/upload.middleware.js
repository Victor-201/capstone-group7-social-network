const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage location for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    
    // Xác định thư mục lưu trữ dựa trên loại tệp đang tải lên
    if (req.route.path === '/upload-cover') {
      uploadDir = path.join(__dirname, '../uploads/covers');
    } else {
      uploadDir = path.join(__dirname, '../uploads/avatars');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created directory: ${uploadDir}`);
    }
    
    // Debug log the destination
    console.log(`Saving file to: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const filePrefix = req.route.path === '/upload-cover' ? 'cover-' : 'avatar-';
    const filename = filePrefix + uniqueSuffix + fileExt;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  console.log(`Received file: ${file.originalname}, mimetype: ${file.mimetype}`);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    console.log(`File rejected: not an allowed image type`);
    cb(new Error('Chỉ chấp nhận file hình ảnh: jpeg, jpg, png, gif, webp'));
  }
};

// Export multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;