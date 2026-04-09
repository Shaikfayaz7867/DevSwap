'use client';

import { motion, PanInfo } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SwipeCandidate } from '@/types';

export function SwipeCard({
  candidate,
  onSwipe,
}: {
  candidate: SwipeCandidate;
  onSwipe: (action: 'like' | 'skip') => void;
}) {
  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 120) onSwipe('like');
    if (info.offset.x < -120) onSwipe('skip');
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="space-y-5 p-7">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold">{candidate.name}</h3>
          <Badge className="border-primary/30 bg-primary/10 text-primary">{candidate.matchScore}% fit</Badge>
        </div>
        <p className="rounded-xl bg-muted/45 px-3 py-2 text-sm text-foreground/70">
          {candidate.role} • {candidate.experience} • {candidate.company}
        </p>
        <p className="text-sm leading-6">{candidate.bio || 'No bio added yet.'}</p>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-foreground/60">Offers</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skillsOffered?.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-foreground/60">Wants</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skillsWanted?.map((skill) => (
              <Badge key={skill} className="bg-transparent">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
