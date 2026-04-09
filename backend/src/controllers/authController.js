const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { signToken } = require('../services/tokenService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const responseWithAuth = (user) => ({
  token: signToken(user._id),
  user,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    authProvider: 'local',
  });

  res.status(201).json(responseWithAuth(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password) throw new ApiError(401, 'Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  res.json(responseWithAuth(user));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload?.email) throw new ApiError(400, 'Invalid Google token');

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
      authProvider: 'google',
      profileImage: payload.picture || '',
    });
  }

  res.json(responseWithAuth(user));
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, login, googleLogin, me };
