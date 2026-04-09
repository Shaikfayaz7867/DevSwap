const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, enum: ['like', 'skip'], required: true },
    score: { type: Number, default: 0 },
  },
  { timestamps: true },
);

swipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
