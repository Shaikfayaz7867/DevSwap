const express = require('express');

const { getCandidates, swipeUser } = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { swipeSchema } = require('../validators/swipeValidators');

const router = express.Router();

router.get('/candidates', protect, getCandidates);
router.post('/', protect, validateBody(swipeSchema), swipeUser);

module.exports = router;
