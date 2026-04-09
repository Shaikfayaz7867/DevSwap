const { ApiError } = require('../utils/apiError');

const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues.map((i) => i.message).join(', '));
  }

  req.body = result.data;
  next();
};

module.exports = { validateBody };
