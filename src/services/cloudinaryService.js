const cloudinary = require("../config/cloudinary");

const uploadImage = async (filePath, folder = "qrgenerador") => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });
};

module.exports = { uploadImage };
