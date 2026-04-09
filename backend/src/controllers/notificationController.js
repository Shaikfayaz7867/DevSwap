const Notification = require('../models/Notification');
const { asyncHandler } = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { read: true });
  res.json({ success: true });
});

module.exports = { getNotifications, markRead };
