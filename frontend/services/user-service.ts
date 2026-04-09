import { apiRequest } from '@/services/api';
import { AuthUser, Post } from '@/types';

export const getMyProfile = (token: string) => apiRequest<{ user: AuthUser; posts: Post[] }>('/users/me', { token });

export const getProfile = (token: string, id: string) =>
  apiRequest<{ user: AuthUser; posts: Post[] }>(`/users/${id}`, { token });

export const updateProfile = (token: string, payload: Partial<AuthUser>) =>
  apiRequest<{ user: AuthUser }>('/users/me', { method: 'PATCH', token, body: payload });

export const getBookmarks = (token: string) =>
  apiRequest<{ bookmarks: Post[] }>('/users/bookmarks', { token });
