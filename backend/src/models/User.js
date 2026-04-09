const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String },
    profileImage: { type: String, default: '' },
    role: { type: String, default: '' },
    experience: { type: String, default: '' },
    company: { type: String, default: '' },
    skillsOffered: [{ type: String, trim: true }],
    skillsWanted: [{ type: String, trim: true }],
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    certifications: [{ type: String, trim: true }],
    bio: { type: String, default: '' },
    goals: { type: String, default: '' },
    preferences: {
      preferredExperienceLevels: [{ type: String }],
      preferredSkills: [{ type: String }],
      openToMentoring: { type: Boolean, default: true },
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    onboardingCompleted: { type: Boolean, default: false },
    profileCompletion: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    lastSeenAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
