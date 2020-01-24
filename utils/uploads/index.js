const { uploader } = require("cloudinary");
const path = require('path');
const Datauri = require('datauri');

const config = require('./config');

config();

const uploadToCloud = (file) => (new Promise((resolve) => {
  /**
     * @description This function uploads to a file to the cloudinary storage
     * @param {Buffer} containing the file to be uploaded
     * @returns {Promise} The promise resolves to an object
  */
  const dataUri = new Datauri();
  const { originalname, buffer } = file;
  const fileUri = dataUri.format(
    path.extname(originalname).toString(),
    buffer,
  ).content;

  uploader.upload(
    fileUri,
    (result) => {
      resolve({ url: result.secure_url, id: result.public_id });
    },
    { resource_type: "auto" },
  );
}));

module.exports = uploadToCloud;
