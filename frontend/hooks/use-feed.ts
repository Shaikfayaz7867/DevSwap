'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost, getFeed, likePost } from '@/services/post-service';
import { useAuthStore } from '@/store/auth-store';

export function useFeed(tag?: string) {
  const token = useAuthStore((s) => s.token);

  return useInfiniteQuery({
    queryKey: ['feed', token, tag],
    queryFn: ({ pageParam }) => getFeed(token || '', pageParam, tag),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(token),
  });
}

export function useCreatePost() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; description: string; tags?: string[]; images?: string[] }) =>
      createPost(token || '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useLikePost() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likePost(token || '', postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });
}
