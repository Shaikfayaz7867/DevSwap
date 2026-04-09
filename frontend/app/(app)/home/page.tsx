'use client';

import { Heart, X } from 'lucide-react';

import { SwipeCard } from '@/components/swipe/swipe-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSwipeAction, useSwipeCandidates } from '@/hooks/use-swipes';

export default function HomePage() {
  const { data, isLoading } = useSwipeCandidates();
  const swipeMutation = useSwipeAction();

  const candidate = data?.candidates?.[0];

  if (isLoading) return <Card className="p-8 text-sm text-foreground/70">Loading candidates...</Card>;
  if (!candidate) return <Card className="p-8 text-sm text-foreground/70">No more candidates. Check back later.</Card>;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="surface flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">Discover</p>
          <h1 className="font-display text-xl font-bold">Your next dev match</h1>
        </div>
        <p className="rounded-full bg-muted/70 px-3 py-1 text-xs text-foreground/70">Swipe or tap actions</p>
      </div>

      <SwipeCard
        candidate={candidate}
        onSwipe={(action) => swipeMutation.mutate({ targetUserId: candidate._id, action })}
      />
      <div className="flex justify-center gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="min-w-32"
          onClick={() => swipeMutation.mutate({ targetUserId: candidate._id, action: 'skip' })}
        >
          <X className="mr-1 h-4 w-4" /> Skip
        </Button>
        <Button
          size="lg"
          className="min-w-32"
          onClick={() => swipeMutation.mutate({ targetUserId: candidate._id, action: 'like' })}
        >
          <Heart className="mr-1 h-4 w-4" /> Like
        </Button>
      </div>
    </div>
  );
}
