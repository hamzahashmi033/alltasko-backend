const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define paths based on environment
const uploadDir = process.env.NODE_ENV === 'production'
  ? '/app/uploads'  // Docker container path
  : path.join(__dirname, '../../uploads'); // Local dev path

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Skip directory creation in production (handled by Dockerfile)
    if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
        mode: 0o755
      });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`); // More unique filename
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;