const mongoose = require('mongoose');

const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { calculateMatchScore } = require('../services/matchingService');
const { createNotification } = require('../services/notificationService');

const getCandidates = asyncHandler(async (req, res) => {
  const swiped = await Swipe.find({ fromUser: req.user._id }).select('toUser');
  const swipedIds = swiped.map((s) => s.toUser);

  const users = await User.find({
    _id: { $nin: [...swipedIds, req.user._id] },
    onboardingCompleted: true,
  })
    .select('name role experience profileImage company skillsOffered skillsWanted bio profileCompletion')
    .limit(20);

  const withScores = users.map((candidate) => ({
    ...candidate.toObject(),
    matchScore: calculateMatchScore(req.user, candidate),
  }));

  res.json({ candidates: withScores });
});

const swipeUser = asyncHandler(async (req, res) => {
  const { targetUserId, action } = req.body;

  if (!mongoose.isValidObjectId(targetUserId)) throw new ApiError(400, 'Invalid target user id');

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new ApiError(404, 'Target user not found');

  const score = calculateMatchScore(req.user, targetUser);

  const swipe = await Swipe.findOneAndUpdate(
    { fromUser: req.user._id, toUser: targetUserId },
    { action, score },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  let matchCreated = false;

  if (action === 'like') {
    const reverseLike = await Swipe.findOne({
      fromUser: targetUserId,
      toUser: req.user._id,
      action: 'like',
    });

    if (reverseLike) {
      const existing = await Match.findOne({ users: { $all: [req.user._id, targetUserId] } });
      if (!existing) {
        await Match.create({ users: [req.user._id, targetUserId] });
        matchCreated = true;

        await createNotification({
          userId: targetUserId,
          type: 'match',
          title: 'New Match!',
          body: `${req.user.name} matched with you.`,
          data: { userId: req.user._id },
        });
      }
    }
  }

  res.json({ swipe, matchCreated });
});

module.exports = { getCandidates, swipeUser };
