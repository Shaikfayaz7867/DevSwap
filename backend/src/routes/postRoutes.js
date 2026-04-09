const express = require('express');

const {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  getPostComments,
  toggleBookmark,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { createPostSchema, commentSchema } = require('../validators/postValidators');

const router = express.Router();

router.get('/', protect, getFeed);
router.post('/', protect, validateBody(createPostSchema), createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);
router.get('/:id/comments', protect, getPostComments);
router.post('/:id/comments', protect, validateBody(commentSchema), addComment);

module.exports = router;
