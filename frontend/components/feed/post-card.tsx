'use client';

import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';

export function PostCard({
  post,
  onLike,
  onBookmark,
  onComment,
}: {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <Avatar src={post.userId.profileImage} alt={post.userId.name} />
        <div>
          <p className="text-sm font-semibold">{post.userId.name}</p>
          <p className="text-xs text-foreground/60">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <h3 className="font-display text-2xl font-bold leading-tight">{post.title}</h3>
      {post.images?.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.images.map((url) => (
            <img key={url} src={url} alt="" className="h-32 w-32 rounded-xl object-cover" />
          ))}
        </div>
      ) : null}
      <article className="prose prose-sm mt-2 max-w-none prose-headings:text-foreground prose-p:text-foreground/90 dark:prose-invert">
        <ReactMarkdown className="prose prose-invert max-w-none text-sm text-foreground/80">{post.description}</ReactMarkdown>
      </article>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} className="bg-muted/60">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-4">
        <Button variant="secondary" size="sm" onClick={onLike}>
          <Heart className="mr-1 h-4 w-4" /> {post.likes.length}
        </Button>
        <Button variant="secondary" size="sm" onClick={onComment}>
          <MessageCircle className="mr-1 h-4 w-4" /> {post.commentsCount}
        </Button>
        <Button variant="ghost" size="sm" onClick={onBookmark}>
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
