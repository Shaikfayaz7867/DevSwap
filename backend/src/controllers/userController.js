const mongoose = require('mongoose');

const User = require('../models/User');
const Post = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');

const calcProfileCompletion = (payload) => {
  const keys = [
    'name',
    'profileImage',
    'role',
    'experience',
    'company',
    'skillsOffered',
    'skillsWanted',
    'github',
    'bio',
    'goals',
  ];

  let done = 0;
  keys.forEach((key) => {
    const value = payload[key];
    if (Array.isArray(value)) {
      if (value.length) done += 1;
      return;
    }
    if (value) done += 1;
  });

  return Math.round((done / keys.length) * 100);
};

const getProfile = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id || req.user._id;
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw new ApiError(400, 'Invalid user id');
  }

  const user = await User.findById(targetUserId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);

  res.json({ user, posts });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const current = await User.findById(req.user._id);
  const merged = { ...current.toObject(), ...updates };
  merged.profileCompletion = calcProfileCompletion(merged);

  const user = await User.findByIdAndUpdate(req.user._id, merged, { new: true }).select('-password');

  res.json({ user });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    populate: { path: 'userId', select: 'name profileImage role experience' },
  });

  res.json({ bookmarks: user.bookmarks || [] });
});

module.exports = { getProfile, updateProfile, getBookmarks };
