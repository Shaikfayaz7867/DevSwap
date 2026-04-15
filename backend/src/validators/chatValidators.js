const { z } = require('zod');

const sendMessageSchema = z.object({
  matchId: z.string().min(8),
  receiverId: z.string().min(8),
  message: z.string().trim().max(2000).optional().default(''),
  fileUrl: z.string().url().optional(),
}).refine((data) => Boolean(data.message?.trim() || data.fileUrl), {
  message: 'Either message text or file is required',
});

module.exports = { sendMessageSchema };
