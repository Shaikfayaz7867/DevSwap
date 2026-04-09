'use client';

import { Card } from '@/components/ui/card';
import { ChatWindow } from '@/components/chat/chat-window';
import { useMatches } from '@/hooks/use-matches';
import { useUiStore } from '@/store/ui-store';

export default function ChatPage() {
  const { data } = useMatches();
  const selectedMatchId = useUiStore((s) => s.selectedMatchId);
  const setSelectedMatchId = useUiStore((s) => s.setSelectedMatchId);

  const selected =
    data?.matches?.find((m) => m._id === selectedMatchId) || data?.matches?.[0];

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <Card className="h-fit p-3">
        <h2 className="px-2 pb-2 pt-1 font-display text-lg font-bold">Conversations</h2>
        {(data?.matches || []).map((match) => (
          <button
            key={match._id}
            type="button"
            className={`mb-1 w-full rounded-2xl border border-transparent px-3 py-2.5 text-left text-sm transition-all ${selected?._id === match._id ? 'border-primary/35 bg-primary/10' : 'hover:bg-muted/70'}`}
            onClick={() => setSelectedMatchId(match._id)}
          >
            <div className="font-medium text-foreground">{match.otherUser.name}</div>
            <div className="text-xs text-foreground/60">{match.otherUser.role}</div>
          </button>
        ))}
      </Card>

      {selected ? (
        <ChatWindow matchId={selected._id} receiver={selected.otherUser} />
      ) : (
        <Card className="p-8 text-foreground/70">Pick a match to start chatting.</Card>
      )}
    </div>
  );
}
