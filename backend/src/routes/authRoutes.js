const express = require('express');

const { register, login, googleLogin, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { registerSchema, loginSchema, googleSchema } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/google', validateBody(googleSchema), googleLogin);
router.get('/me', protect, me);

module.exports = router;
