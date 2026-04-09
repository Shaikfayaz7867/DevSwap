const { z } = require('zod');

const onboardingSchema = z.object({
  name: z.string().min(2).max(60),
  profileImage: z.string().url().optional().or(z.literal('')),
  role: z.string().min(2).max(50),
  experience: z.string().min(2).max(50),
  company: z.string().max(80).optional().or(z.literal('')),
  skillsOffered: z.array(z.string().min(1)).min(1),
  skillsWanted: z.array(z.string().min(1)).min(1),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  certifications: z.array(z.string().min(1)).optional().default([]),
  bio: z.string().max(500).optional().or(z.literal('')),
  goals: z.string().max(300).optional().or(z.literal('')),
  preferences: z.object({
    preferredExperienceLevels: z.array(z.string()).default([]),
    preferredSkills: z.array(z.string()).default([]),
    openToMentoring: z.boolean().default(true),
  }),
});

module.exports = { onboardingSchema };
