const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { createNotification } = require('../services/notificationService');

const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.tag) {
    query.tags = req.query.tag.toLowerCase();
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name profileImage role experience');

  const hasMore = posts.length === limit;
  res.json({ posts, page, hasMore });
});

const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    userId: req.user._id,
    title: req.body.title,
    description: req.body.description,
    images: req.body.images || [],
    tags: (req.body.tags || []).map((tag) => tag.toLowerCase()),
  });

  res.status(201).json({ post });
});

const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid post id');

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, 'Post not found');

  const exists = post.likes.some((u) => u.toString() === req.user._id.toString());

  if (exists) {
    post.likes = post.likes.filter((u) => u.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
    if (post.userId.toString() !== req.user._id.toString()) {
      await createNotification({
        userId: post.userId,
        type: 'like',
        title: 'New Like',
        body: `${req.user.name} liked your post`,
        data: { postId: post._id, userId: req.user._id },
      });
    }
  }

  await post.save();

  res.json({ liked: !exists, likesCount: post.likes.length });
});

const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({
    postId: post._id,
    userId: req.user._id,
    comment: req.body.comment,
  });

  post.commentsCount += 1;
  await post.save();

  if (post.userId.toString() !== req.user._id.toString()) {
    await createNotification({
      userId: post.userId,
      type: 'comment',
      title: 'New Comment',
      body: `${req.user.name} commented on your post`,
      data: { postId: post._id, commentId: comment._id },
    });
  }

  const populated = await comment.populate('userId', 'name profileImage role');
  res.status(201).json({ comment: populated });
});

const getPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id })
    .sort({ createdAt: 1 })
    .populate('userId', 'name profileImage role');

  res.json({ comments });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const user = await User.findById(req.user._id);
  const bookmarked = user.bookmarks.some((p) => p.toString() === post._id.toString());

  if (bookmarked) {
    user.bookmarks = user.bookmarks.filter((p) => p.toString() !== post._id.toString());
  } else {
    user.bookmarks.push(post._id);
  }

  await user.save();
  res.json({ bookmarked: !bookmarked });
});

module.exports = {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  getPostComments,
  toggleBookmark,
};
