const Match = require('../models/Match');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const getMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ users: req.user._id }).sort({ createdAt: -1 });

  const detailed = await Promise.all(
    matches.map(async (match) => {
      const otherUserId = match.users.find((id) => id.toString() !== req.user._id.toString());
      const otherUser = await User.findById(otherUserId).select(
        'name profileImage role experience company isOnline lastSeenAt',
      );
      return { ...match.toObject(), otherUser };
    }),
  );

  res.json({ matches: detailed });
});

module.exports = { getMatches };
