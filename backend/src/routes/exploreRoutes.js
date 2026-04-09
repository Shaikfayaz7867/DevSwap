const express = require('express');

const { getExplore } = require('../controllers/exploreController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getExplore);

module.exports = router;
