const multer = require("multer");

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB limit
});

module.exports = upload;
