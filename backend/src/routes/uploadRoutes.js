const express = require('express');

const { upload, uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/image', protect, upload.single('image'), uploadImage);

module.exports = router;
