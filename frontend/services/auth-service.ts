import { apiRequest } from '@/services/api';
import { AuthUser } from '@/types';

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export const registerRequest = (payload: { name: string; email: string; password: string }) =>
  apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: payload });

export const loginRequest = (payload: { email: string; password: string }) =>
  apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload });

export const googleLoginRequest = (payload: { idToken: string }) =>
  apiRequest<AuthResponse>('/auth/google', { method: 'POST', body: payload });

export const meRequest = (token: string) =>
  apiRequest<{ user: AuthUser }>('/auth/me', { token });
