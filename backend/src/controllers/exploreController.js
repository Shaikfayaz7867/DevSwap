const Post = require('../models/Post');
const User = require('../models/User');

const { asyncHandler } = require('../utils/asyncHandler');

const getExplore = asyncHandler(async (_req, res) => {
  const trendingPosts = await Post.find().sort({ likes: -1, createdAt: -1 }).limit(10).populate('userId', 'name profileImage role');

  const topUsers = await User.find({ onboardingCompleted: true })
    .sort({ profileCompletion: -1, createdAt: -1 })
    .limit(10)
    .select('name profileImage role experience skillsOffered profileCompletion');

  const tagAgg = await Post.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  res.json({
    trendingPosts,
    topUsers,
    popularTags: tagAgg.map((t) => ({ tag: t._id, count: t.count })),
  });
});

module.exports = { getExplore };
