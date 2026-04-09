const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = async (filePath, folder = 'devswap') => {
  const response = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
  });

  return response.secure_url;
};

module.exports = { uploadToCloudinary };
