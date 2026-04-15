'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { PostCard } from '@/components/feed/post-card';
import { Post } from '@/types';

interface VirtualizedFeedProps {
  posts: Post[];
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onComment: (id: string) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function VirtualizedFeed({
  posts,
  onLike,
  onBookmark,
  onComment,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: VirtualizedFeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 5,
  });

  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-8 text-center text-sm text-foreground/65">
        No posts yet. Be the first one to share something useful.
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-14rem)] min-h-[28rem] overflow-auto scrollbar-hide">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index === posts.length;
          const post = posts[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="flex justify-center py-4">
                  {hasNextPage && (
                    <button
                      className="rounded-xl border border-border/70 bg-card/70 px-4 py-2 text-sm transition hover:border-primary/40"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-1">
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={() => onLike(post._id)}
                    onBookmark={() => onBookmark(post._id)}
                    onComment={() => onComment(post._id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
