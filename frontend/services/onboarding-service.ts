import { apiRequest } from '@/services/api';
import { AuthUser } from '@/types';

export type OnboardingPayload = {
  name: string;
  profileImage?: string;
  role: string;
  experience: string;
  company?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  github?: string;
  portfolio?: string;
  certifications: string[];
  bio?: string;
  goals?: string;
  preferences: {
    preferredExperienceLevels: string[];
    preferredSkills: string[];
    openToMentoring: boolean;
  };
};

export const completeOnboardingRequest = (token: string, payload: OnboardingPayload) =>
  apiRequest<{ user: AuthUser }>('/onboarding', { method: 'POST', token, body: payload });
