const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
