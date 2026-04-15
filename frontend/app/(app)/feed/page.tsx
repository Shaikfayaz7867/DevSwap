'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { VirtualizedFeed } from '@/components/feed/virtualized-feed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSocket } from '@/hooks/use-socket';
import { useAddPostComment, useCreatePost, useFeed, useLikePost, usePostComments, useToggleBookmark } from '@/hooks/use-feed';
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

export default function FeedPage() {
  const token = useAuthStore((s) => s.token);
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const [tag, setTag] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);

  const feed = useFeed(tag || undefined);
  const createPost = useCreatePost();
  const likePost = useLikePost();
  const toggleBookmark = useToggleBookmark();
  const comments = usePostComments(selectedPostId || undefined);
  const addComment = useAddPostComment(selectedPostId || undefined);

  const posts = feed.data?.pages.flatMap((p) => p.posts) || [];
  const commentList = useMemo(() => comments.data?.comments || [], [comments.data?.comments]);

  const commentsByParent = useMemo(() => {
    const map = new Map<string, FeedComment[]>();

    commentList.forEach((comment) => {
      const key = comment.parentCommentId || 'root';
      const list = map.get(key) || [];
      list.push(comment);
      map.set(key, list);
    });

    return map;
  }, [commentList]);

  useEffect(() => {
    if (!socket || !token) return;

    socket.emit('room:join', 'feed');

    const handlePostLiked = ({ postId }: { postId: string; likesCount: number }) => {
      queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] }, (old) =>
        updateFeedPost(old, postId, (post) => post),
      );
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    };

    const handleCommentAdded = ({ postId, commentsCount }: { postId: string; commentsCount: number }) => {
      queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] }, (old) =>
        updateFeedPost(old, postId, (post) => ({ ...post, commentsCount })),
      );
      if (selectedPostId === postId) {
        queryClient.invalidateQueries({ queryKey: ['post-comments', token, postId] });
      }
    };

    const handleBookmarkToggled = ({ postId, bookmarked }: { postId: string; bookmarked: boolean }) => {
      queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] }, (old) =>
        updateFeedPost(old, postId, (post) => ({ ...post, isBookmarked: bookmarked })),
      );
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    };

    socket.on('feed:postLiked', handlePostLiked);
    socket.on('feed:commentAdded', handleCommentAdded);
    socket.on('feed:bookmarkToggled', handleBookmarkToggled);

    return () => {
      socket.off('feed:postLiked', handlePostLiked);
      socket.off('feed:commentAdded', handleCommentAdded);
      socket.off('feed:bookmarkToggled', handleBookmarkToggled);
    };
  }, [socket, token, queryClient, selectedPostId]);

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Feed</h1>
            <p className="text-sm text-foreground/65">Clean timeline of what developers are sharing right now.</p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter by tag (react, dsa...)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-[220px]"
            />
            <Button size="sm" onClick={() => setComposerOpen(true)}>
              <Plus className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </Card>

      <VirtualizedFeed
        posts={posts}
        onLike={(id) => likePost.mutate(id)}
        onBookmark={(id) => toggleBookmark.mutate(id)}
        onComment={(id) => setSelectedPostId(id)}
        fetchNextPage={() => feed.fetchNextPage()}
        hasNextPage={feed.hasNextPage}
        isFetchingNextPage={feed.isFetchingNextPage}
      />

      {composerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onClick={() => setComposerOpen(false)}>
          <Card className="w-full max-w-2xl space-y-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">Share what you learned</h2>
                <p className="text-sm text-foreground/65">Post a quick insight, a lesson learned, or a useful resource.</p>
              </div>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setComposerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
              placeholder="Write markdown content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-36"
            />
            <FileUpload value={images} onChange={setImages} />
            <div className="flex justify-end">
              <Button
                size="sm"
                disabled={!title || !description || createPost.isPending}
                onClick={() => {
                  createPost.mutate(
                    { title, description, tags: tag ? [tag] : [], images },
                    {
                      onSuccess: () => {
                        setTitle('');
                        setDescription('');
                        setImages([]);
                        setComposerOpen(false);
                      },
                    },
                  );
                }}
              >
                {createPost.isPending ? 'Publishing...' : 'Publish post'}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {selectedPostId ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-3 backdrop-blur-sm"
          onClick={() => {
            setSelectedPostId(null);
            setReplyTo(null);
            setCommentText('');
          }}
        >
          <Card className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden p-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <h3 className="font-display text-xl font-bold">Comments</h3>
                <p className="text-sm text-foreground/65">Instagram-like threads with replies.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => {
                  setSelectedPostId(null);
                  setReplyTo(null);
                  setCommentText('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {(commentsByParent.get('root') || []).map((item) => {
                const replies = commentsByParent.get(item._id) || [];

                return (
                  <div key={item._id} className="rounded-2xl border border-border/70 bg-background/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
                      {item.userId?.name || 'Developer'}
                    </p>
                    <p className="mt-1 text-sm text-foreground/85">{item.comment}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-primary/90 hover:text-primary"
                      onClick={() => setReplyTo(item)}
                    >
                      Reply
                    </button>

                    {replies.length ? (
                      <div className="mt-3 space-y-2 border-l border-border/60 pl-3">
                        {replies.map((reply) => (
                          <div key={reply._id} className="rounded-xl bg-background/50 p-2.5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/55">
                              {reply.userId?.name || 'Developer'}
                            </p>
                            <p className="mt-1 text-sm text-foreground/80">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {comments.isLoading ? <p className="text-sm text-foreground/60">Loading comments...</p> : null}
              {!comments.isLoading && !commentList.length ? (
                <p className="text-sm text-foreground/60">No comments yet. Start the conversation.</p>
              ) : null}
            </div>

            <div className="space-y-2 border-t border-border/70 px-5 py-4">
              {replyTo ? (
                <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary">
                  <span>Replying to @{replyTo.userId?.name || 'developer'}</span>
                  <button type="button" onClick={() => setReplyTo(null)}>
                    Cancel
                  </button>
                </div>
              ) : null}

              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={replyTo ? `Reply to ${replyTo.userId?.name || 'comment'}...` : 'Add a comment...'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-12"
                />
                <Button
                  size="sm"
                  disabled={!commentText.trim() || addComment.isPending}
                  onClick={() => {
                    const content = commentText.trim();
                    if (!content) return;
                    addComment.mutate({ comment: content, parentCommentId: replyTo?._id }, {
                      onSuccess: () => setCommentText(''),
                    });
                    setReplyTo(null);
                  }}
                >
                  {addComment.isPending ? 'Posting...' : 'Post comment'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
