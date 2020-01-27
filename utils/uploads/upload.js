const multer = require("multer");

const storage = multer.memoryStorage();
// Allow for a maximum of 5mb image upload size.
const limits = { fileSize: 5000 };
const upload = multer({ storage, limits }).single('image');

module.exports = upload;
