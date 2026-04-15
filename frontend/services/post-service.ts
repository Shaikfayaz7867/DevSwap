import { apiRequest } from '@/services/api';
import { FeedComment, Post } from '@/types';

export const getFeed = (token: string, page = 1, tag?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  if (tag) params.set('tag', tag);
  return apiRequest<{ posts: Post[]; page: number; hasMore: boolean }>(`/posts?${params.toString()}`, { token });
};

export const createPost = (
  token: string,
  payload: { title: string; description: string; images?: string[]; tags?: string[] },
) => apiRequest<{ post: Post }>('/posts', { method: 'POST', token, body: payload });

export const likePost = (token: string, postId: string) =>
  apiRequest<{ liked: boolean; likesCount: number }>(`/posts/${postId}/like`, { method: 'POST', token });

export const bookmarkPost = (token: string, postId: string) =>
  apiRequest<{ bookmarked: boolean }>(`/posts/${postId}/bookmark`, { method: 'POST', token });

export const getComments = (token: string, postId: string) =>
  apiRequest<{ comments: FeedComment[] }>(`/posts/${postId}/comments`, { token });

export const addComment = (token: string, postId: string, payload: { comment: string; parentCommentId?: string }) =>
  apiRequest<{ comment: FeedComment }>(`/posts/${postId}/comments`, {
    method: 'POST',
    token,
    body: payload,
  });
