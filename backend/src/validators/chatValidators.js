const { z } = require('zod');

const sendMessageSchema = z.object({
  matchId: z.string().min(8),
  receiverId: z.string().min(8),
  message: z.string().min(1).max(2000),
});

module.exports = { sendMessageSchema };
