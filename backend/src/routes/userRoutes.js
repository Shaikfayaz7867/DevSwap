const express = require('express');

const { getProfile, updateProfile, getBookmarks } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { updateProfileSchema } = require('../validators/userValidators');

const router = express.Router();

router.get('/me', protect, getProfile);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', protect, getProfile);
router.patch('/me', protect, validateBody(updateProfileSchema), updateProfile);

module.exports = router;
