const multer = require("multer");
const path = require("path");

// Ensure the uploads directory exists
const fs = require("fs");
const uploadDir = process.env.NODE_ENV === 'production'
    ? '/root/alltasko-backend/uploads'  // Server path
    : path.resolve(__dirname, '../../uploads'); // Local dev path
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
        mode: 0o755  // rwxr-xr-x permissions
    })
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
