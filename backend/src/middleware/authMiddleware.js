const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies.token;

  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid token user');
    }

    req.user = user;
    next();
  } catch (_err) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

module.exports = { protect };
