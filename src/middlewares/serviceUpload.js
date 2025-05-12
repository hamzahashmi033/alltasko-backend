const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Define upload path based on environment
const servicesDir = process.env.NODE_ENV === 'production'
  ? '/app/uploads/services'  // Docker container path
  : path.join(__dirname, '../../uploads/services'); // Local dev path

// Configure storage for service request photos
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Skip directory creation in production (handled by Dockerfile)
    if (process.env.NODE_ENV !== 'production' && !fs.existsSync(servicesDir)) {
      fs.mkdirSync(servicesDir, { 
        recursive: true,
        mode: 0o755  // rwxr-xr-x permissions
      });
    }
    cb(null, servicesDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `service-${uuidv4()}${path.extname(sanitizedName).toLowerCase()}`);
  }
});

// Enhanced file filter
const serviceFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const isValidType = allowedTypes.includes(file.mimetype) && 
                     ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file.originalname).toLowerCase());

  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, or WEBP images are allowed!'), false);
  }
};

const serviceUpload = multer({
  storage: serviceStorage,
  fileFilter: serviceFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Max 5 files per upload
  }
});

module.exports = serviceUpload;