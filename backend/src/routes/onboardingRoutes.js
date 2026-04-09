const express = require('express');

const { completeOnboarding } = require('../controllers/onboardingController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { onboardingSchema } = require('../validators/onboardingValidators');

const router = express.Router();

router.post('/', protect, validateBody(onboardingSchema), completeOnboarding);

module.exports = router;
