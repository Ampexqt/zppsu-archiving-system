const multer = require("multer");

const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to backend/src/uploads
    cb(null, path.join(__dirname, '../../uploads'));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;