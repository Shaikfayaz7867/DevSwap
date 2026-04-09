const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  profileImage: z.string().url().optional(),
  role: z.string().max(50).optional(),
  experience: z.string().max(50).optional(),
  company: z.string().max(80).optional(),
  skillsOffered: z.array(z.string().min(1)).max(30).optional(),
  skillsWanted: z.array(z.string().min(1)).max(30).optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  certifications: z.array(z.string().min(1)).max(30).optional(),
  bio: z.string().max(500).optional(),
  goals: z.string().max(300).optional(),
  preferences: z
    .object({
      preferredExperienceLevels: z.array(z.string()).max(5).optional(),
      preferredSkills: z.array(z.string()).max(30).optional(),
      openToMentoring: z.boolean().optional(),
    })
    .optional(),
});

module.exports = { updateProfileSchema };
