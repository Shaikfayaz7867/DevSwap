const express = require('express');

const { sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateRequest');
const { sendMessageSchema } = require('../validators/chatValidators');

const router = express.Router();

router.post('/messages', protect, validateBody(sendMessageSchema), sendMessage);
router.get('/messages/:matchId', protect, getMessages);

module.exports = router;
