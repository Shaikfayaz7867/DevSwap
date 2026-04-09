const multer = require('multer');

const { asyncHandler } = require('../utils/asyncHandler');
const { uploadToCloudinary } = require('../services/uploadService');
const { ApiError } = require('../utils/apiError');

const storage = multer.diskStorage({});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file?.path) {
    throw new ApiError(400, 'File is required');
  }

  const url = await uploadToCloudinary(req.file.path, 'devswap/uploads');

  res.status(201).json({ url });
});

module.exports = { upload, uploadFile };
