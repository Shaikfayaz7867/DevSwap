import { apiRequest } from '@/services/api';
import { AuthUser, Post } from '@/types';

export type ExploreResponse = {
  trendingPosts: Post[];
  topUsers: AuthUser[];
  popularTags: Array<{ tag: string; count: number }>;
};

export const getExplore = (token: string) => apiRequest<ExploreResponse>('/explore', { token });
