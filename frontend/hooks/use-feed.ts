'use client';

import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addComment, bookmarkPost, createPost, getComments, getFeed, likePost } from '@/services/post-service';
import { useAuthStore } from '@/store/auth-store';
import { FeedComment, Post } from '@/types';

type FeedPage = { posts: Post[]; page: number; hasMore: boolean };

function updateFeedPost(
  old: InfiniteData<FeedPage> | undefined,
  postId: string,
  updater: (post: Post) => Post,
): InfiniteData<FeedPage> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) => (post._id === postId ? updater(post) : post)),
    })),
  };
}

export function useFeed(tag?: string) {
  const token = useAuthStore((s) => s.token);

  return useInfiniteQuery({
    queryKey: ['feed', token, tag],
    queryFn: ({ pageParam }) => getFeed(token || '', pageParam, tag),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(token),
    refetchInterval: 10000,
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
  const userId = useAuthStore((s) => s.user?._id);

  return useMutation({
    mutationFn: (postId: string) => likePost(token || '', postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] });

      previousFeed.forEach(([key, old]) => {
        queryClient.setQueryData<InfiniteData<FeedPage>>(key, updateFeedPost(old, postId, (post) => {
          const alreadyLiked = userId ? post.likes.includes(userId) : false;
          const likes = alreadyLiked
            ? post.likes.filter((id) => id !== userId)
            : userId
              ? [...post.likes, userId]
              : post.likes;
          return { ...post, likes };
        }));
      });

      return { previousFeed };
    },
    onError: (_err, _postId, context) => {
      context?.previousFeed?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useToggleBookmark() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarkPost(token || '', postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] });

      previousFeed.forEach(([key, old]) => {
        queryClient.setQueryData<InfiniteData<FeedPage>>(key, updateFeedPost(old, postId, (post) => ({
          ...post,
          isBookmarked: !post.isBookmarked,
        })));
      });

      return { previousFeed };
    },
    onError: (_err, _postId, context) => {
      context?.previousFeed?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function usePostComments(postId?: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['post-comments', token, postId],
    queryFn: () => getComments(token || '', postId || ''),
    enabled: Boolean(token && postId),
    refetchInterval: 5000,
  });
}

export function useAddPostComment(postId?: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (payload: { comment: string; parentCommentId?: string }) => addComment(token || '', postId || '', payload),
    onMutate: async (payload) => {
      if (!postId) return;

      await queryClient.cancelQueries({ queryKey: ['post-comments', token, postId] });

      const previousComments = queryClient.getQueryData<{ comments: FeedComment[] }>(['post-comments', token, postId]);

      const optimisticComment: FeedComment = {
        _id: `temp-${Date.now()}`,
        postId,
        userId: {
          _id: user?._id || 'me',
          name: user?.name || 'You',
          profileImage: user?.profileImage,
          role: user?.role,
        },
        parentCommentId: payload.parentCommentId || null,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<{ comments: FeedComment[] }>(['post-comments', token, postId], (old) => ({
        comments: [...(old?.comments || []), optimisticComment],
      }));

      const previousFeed = queryClient.getQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] });
      previousFeed.forEach(([key, old]) => {
        queryClient.setQueryData<InfiniteData<FeedPage>>(key, updateFeedPost(old, postId, (post) => ({
          ...post,
          commentsCount: (post.commentsCount || 0) + 1,
        })));
      });

      return { previousComments, previousFeed };
    },
    onError: (_err, _payload, context) => {
      if (postId) {
        queryClient.setQueryData(['post-comments', token, postId], context?.previousComments);
      }
      context?.previousFeed?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post-comments', token, postId] });
    },
  });
}
