const Message = require('../models/Message');
const Match = require('../models/Match');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { getIO } = require('../services/socketService');
const { createNotification } = require('../services/notificationService');

const sendMessage = asyncHandler(async (req, res) => {
  const { matchId, receiverId, message } = req.body;

  const match = await Match.findById(matchId);
  if (!match || !match.users.some((u) => u.toString() === req.user._id.toString())) {
    throw new ApiError(403, 'Match not found or unauthorized');
  }

  const created = await Message.create({
    matchId,
    sender: req.user._id,
    receiver: receiverId,
    message,
  });

  const populated = await created.populate([
    { path: 'sender', select: 'name profileImage' },
    { path: 'receiver', select: 'name profileImage' },
  ]);

  const io = getIO();
  if (io) {
    io.to(matchId).emit('chat:newMessage', populated);
  }

  await createNotification({
    userId: receiverId,
    type: 'message',
    title: 'New Message',
    body: `${req.user.name}: ${message.slice(0, 80)}`,
    data: { matchId, senderId: req.user._id },
  });

  res.status(201).json({ message: populated });
});

const getMessages = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  const match = await Match.findById(matchId);
  if (!match || !match.users.some((u) => u.toString() === req.user._id.toString())) {
    throw new ApiError(403, 'Match not found or unauthorized');
  }

  const messages = await Message.find({ matchId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage');

  res.json({ messages });
});

module.exports = { sendMessage, getMessages };
