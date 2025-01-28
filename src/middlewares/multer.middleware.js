const multer = require("multer");

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory as Buffer

// Configure multer upload with file type and size filters
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true); // File is accepted
    } else {
      cb(new Error("Only PDFs are allowed"), false); // Reject the file with an error message
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit (update comment if necessary)
  },
});

module.exports = upload;
