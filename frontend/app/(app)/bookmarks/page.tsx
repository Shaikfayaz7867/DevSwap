'use client';

import { useQuery } from '@tanstack/react-query';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getBookmarks } from '@/services/user-service';
import { useAuthStore } from '@/store/auth-store';

export default function BookmarksPage() {
  const token = useAuthStore((s) => s.token);

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks', token],
    queryFn: () => getBookmarks(token || ''),
    enabled: Boolean(token),
  });

  if (isLoading) {
    return <Card className="p-6 text-sm text-foreground/70">Loading saved posts...</Card>;
  }

  const bookmarks = data?.bookmarks || [];

  if (!bookmarks.length) {
    return (
      <Card className="p-6">
        <h1 className="font-display text-2xl font-bold">Bookmarks</h1>
        <p className="mt-2 text-sm text-foreground/70">You have no saved posts yet. Bookmark useful posts from the feed.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h1 className="font-display text-2xl font-bold">Bookmarks</h1>
        <p className="mt-1 text-sm text-foreground/70">Quick access to your saved learning resources.</p>
      </Card>

      {bookmarks.map((post) => (
        <Card key={post._id} className="p-0">
          <div className="space-y-3 rounded-[calc(1.5rem-2px)] border border-transparent bg-card/95 p-5">
            <div className="flex items-center gap-3">
              <Avatar src={post.userId?.profileImage} alt={post.userId?.name || 'User'} />
              <div>
                <p className="text-sm font-semibold">{post.userId?.name || 'Developer'}</p>
                <p className="text-xs text-foreground/60">{post.userId?.role || 'Developer'}</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold leading-tight">{post.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-foreground/75">{post.description}</p>
            </div>

            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={`${post._id}-${tag}`} className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
