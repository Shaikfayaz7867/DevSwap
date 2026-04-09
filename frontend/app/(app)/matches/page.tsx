'use client';

import { useRouter } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMatches } from '@/hooks/use-matches';
import { useUiStore } from '@/store/ui-store';

export default function MatchesPage() {
  const { data } = useMatches();
  const setSelectedMatchId = useUiStore((s) => s.setSelectedMatchId);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="surface px-5 py-4">
        <h1 className="font-display text-2xl font-bold">Your Matches</h1>
        <p className="mt-1 text-sm text-foreground/70">Developers who liked you back and are ready to connect.</p>
      </div>

      {(data?.matches || []).map((match) => (
        <Card
          key={match._id}
          className="group flex cursor-pointer items-center justify-between p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35"
          onClick={() => {
            setSelectedMatchId(match._id);
            router.push('/chat');
          }}
        >
          <div className="flex items-center gap-3">
            <Avatar src={match.otherUser.profileImage} alt={match.otherUser.name} />
            <div>
              <p className="font-semibold">{match.otherUser.name}</p>
              <p className="text-xs text-foreground/60">
                {match.otherUser.role} • {match.otherUser.experience}
              </p>
            </div>
          </div>
          <Badge className={match.otherUser.isOnline ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : ''}>
            {match.otherUser.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </Card>
      ))}
    </div>
  );
}
