const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: false, trim: true },
    fileUrl: { type: String, required: false },
    readAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);
