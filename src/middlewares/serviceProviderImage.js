const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create profile pictures directory
const profilePicsDir = process.env.NODE_ENV === 'production'
    ? '/root/alltasko-backend/uploads/profilepictures'  // Server path
    : path.join(__dirname, '../../uploads/profilepictures'); // Local dev path

// Create directory if it doesn't exist
if (!fs.existsSync(profilePicsDir)) {
    fs.mkdirSync(profilePicsDir, {
        recursive: true,
        mode: 0o755  // rwxr-xr-x permissions
    });
}

// Configure multer storage for profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilePicsDir); // Save to profilepictures directory
    },
    filename: function (req, file, cb) {
        // Generate filename: timestamp + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

// File filter to allow only JPG/JPEG and PNG
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only JPEG/JPG and PNG images are allowed!'));
    }
};

const uploadProfilePicture = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = uploadProfilePicture;