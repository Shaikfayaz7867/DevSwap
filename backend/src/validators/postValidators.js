const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(20).max(5000),
  images: z.array(z.string().url()).max(5).optional().default([]),
  tags: z.array(z.string().min(1).max(30)).max(15).optional().default([]),
});

const commentSchema = z.object({
  comment: z.string().min(1).max(500),
});

module.exports = { createPostSchema, commentSchema };
