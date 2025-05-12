const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define paths - Now Docker compatible
const profilePicsDir = process.env.NODE_ENV === 'production'
    ? '/app/uploads/profilepictures'  // Docker container path
    : path.join(__dirname, '../../uploads/profilepictures'); // Local dev path

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Skip directory creation in production (handled by Dockerfile)
        if (process.env.NODE_ENV !== 'production' && !fs.existsSync(profilePicsDir)) {
            fs.mkdirSync(profilePicsDir, { 
                recursive: true,
                mode: 0o755
            });
        }
        cb(null, profilePicsDir);
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `profile-${Date.now()}-${sanitizedName}`);
    }
});

// Enhanced file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isValidType = allowedTypes.includes(file.mimetype) && 
                       ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file.originalname).toLowerCase());

    if (isValidType) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, or WEBP images are allowed!'), false);
    }
};

const uploadProfilePicture = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Only 1 file per upload
    }
});

module.exports = uploadProfilePicture;