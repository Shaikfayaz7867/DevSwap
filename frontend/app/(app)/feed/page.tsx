'use client';

import { useState } from 'react';

import { VirtualizedFeed } from '@/components/feed/virtualized-feed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePost, useFeed, useLikePost } from '@/hooks/use-feed';
import { bookmarkPost } from '@/services/post-service';
import { useAuthStore } from '@/store/auth-store';

export default function FeedPage() {
  const token = useAuthStore((s) => s.token);
  const [tag, setTag] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const feed = useFeed(tag || undefined);
  const createPost = useCreatePost();
  const likePost = useLikePost();

  const posts = feed.data?.pages.flatMap((p) => p.posts) || [];

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Share what you learned</h2>
            <p className="text-sm text-foreground/65">Post a quick insight, a lesson learned, or a useful resource.</p>
          </div>
          <span className="rounded-full bg-muted/70 px-3 py-1 text-xs text-foreground/65">Markdown supported</span>
        </div>
        <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Write markdown content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ImageUpload value={images} onChange={setImages} />
        <div className="flex justify-end">
          <Button
            onClick={() => {
              createPost.mutate({ title, description, tags: tag ? [tag] : [], images });
              setTitle('');
              setDescription('');
              setImages([]);
            }}
            disabled={!title || !description || createPost.isPending}
          >
            Publish post
          </Button>
        </div>
      </Card>

      <Card className="p-3">
        <Input placeholder="Filter by tag (react, dsa... )" value={tag} onChange={(e) => setTag(e.target.value)} />
      </Card>

      <VirtualizedFeed
        posts={posts}
        onLike={(id) => likePost.mutate(id)}
        onBookmark={(id) => {
          if (token) bookmarkPost(token, id);
        }}
        onComment={() => {}}
        fetchNextPage={() => feed.fetchNextPage()}
        hasNextPage={feed.hasNextPage}
        isFetchingNextPage={feed.isFetchingNextPage}
      />
    </div>
  );
}
