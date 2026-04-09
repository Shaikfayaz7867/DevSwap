import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password is required'),
});

export const onboardingSchema = z.object({
  name: z.string().min(2),
  profileImage: z.string().url().or(z.literal('')).optional(),
  role: z.string().min(2),
  experience: z.string().min(1),
  company: z.string().optional(),
  skillsOffered: z.array(z.string().min(1)).min(1),
  skillsWanted: z.array(z.string().min(1)).min(1),
  github: z.string().url().or(z.literal('')).optional(),
  portfolio: z.string().url().or(z.literal('')).optional(),
  certifications: z.array(z.string().min(1)).default([]),
  bio: z.string().max(500).optional(),
  goals: z.string().max(300).optional(),
  preferences: z.object({
    preferredExperienceLevels: z.array(z.string()).default([]),
    preferredSkills: z.array(z.string()).default([]),
    openToMentoring: z.boolean().default(true),
  }),
});

export const postSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type PostFormValues = z.infer<typeof postSchema>;
