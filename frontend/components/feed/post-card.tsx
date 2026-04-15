'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/auth-store';

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
  const user = useAuthStore((s) => s.user);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const descriptionThreshold = 150;
  const isDescriptionLong = post.description.length > descriptionThreshold;
  const displayDescription = isExpanded || !isDescriptionLong 
    ? post.description 
    : post.description.substring(0, descriptionThreshold) + '...';

  const isLiked = user && post.likes.includes(user._id);
  const isBookmarked = Boolean(post.isBookmarked);

  return (
    <Card className="overflow-hidden p-0 border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar src={post.userId?.profileImage} alt={post.userId?.name || 'User'} className="ring-2 ring-primary/20" />
        <div className="flex-1">
          <p className="text-sm font-bold tracking-tight">{post.userId?.name || 'Deleted User'}</p>
          <p className="text-[10px] uppercase font-medium text-foreground/45 tracking-wider">
            {isMounted ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
          </p>
        </div>
      </div>

      {/* Content Area - Full Width Image/PDF */}
      {post.images?.length ? (
        <div className="relative w-full overflow-hidden bg-black/5">
          {post.images.map((url) => {
            if (url.toLowerCase().endsWith('.pdf')) {
              return (
                <div key={url} className="px-4 py-8 flex flex-col items-center justify-center bg-muted/20">
                  <a href={url} download target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3 rounded-2xl bg-background/80 p-6 shadow-xl border border-border/50 hover:border-primary/50 transition-all">
                    <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <span className="text-sm font-semibold tracking-tight">View Resource PDF</span>
                  </a>
                </div>
              );
            }
            return (
              <img 
                key={url} 
                src={url} 
                alt={post.title} 
                className="w-full h-auto max-h-[600px] object-cover select-none"
                loading="lazy"
              />
            );
          })}
        </div>
      ) : null}

      {/* Action Row */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <Button variant="ghost" size="sm" className="group h-10 w-10 p-0 text-foreground/70 hover:text-primary transition-colors" onClick={onLike}>
          <Heart className={cn("h-5 w-5 transition-transform group-active:scale-125", isLiked ? "fill-primary text-primary" : "")} />
        </Button>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-foreground/70 hover:text-primary transition-colors" onClick={onComment}>
          <MessageCircle className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-foreground/70 hover:text-primary transition-colors" onClick={onBookmark}>
          <Bookmark className={cn('h-5 w-5', isBookmarked ? 'fill-primary text-primary' : '')} />
        </Button>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <p className="text-sm font-bold">
          {post.likes.length} <span className="font-medium text-foreground/60">likes</span>
        </p>
        <button type="button" className="text-xs text-foreground/55 hover:text-foreground transition-colors" onClick={onComment}>
          View all {post.commentsCount || 0} comments
        </button>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-bold leading-tight">{post.title}</h3>
          <article className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/80 dark:prose-invert">
            <ReactMarkdown className="text-sm leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </ReactMarkdown>
          </article>
          
          {isDescriptionLong && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-foreground/40 hover:text-foreground transition-colors mt-1"
            >
              {isExpanded ? 'show less' : 'more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

