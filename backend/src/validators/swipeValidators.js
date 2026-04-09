const { z } = require('zod');

const swipeSchema = z.object({
  targetUserId: z.string().min(8),
  action: z.enum(['like', 'skip']),
});

module.exports = { swipeSchema };
