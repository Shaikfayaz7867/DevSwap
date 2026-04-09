const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const completeOnboarding = asyncHandler(async (req, res) => {
  const payload = req.body;

  const profileCompletion = [
    payload.name,
    payload.role,
    payload.experience,
    payload.skillsOffered?.length,
    payload.skillsWanted?.length,
    payload.bio,
    payload.goals,
  ].filter(Boolean).length;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...payload,
      onboardingCompleted: true,
      profileCompletion: Math.round((profileCompletion / 7) * 100),
    },
    { new: true },
  ).select('-password');

  res.json({ user });
});

module.exports = { completeOnboarding };
