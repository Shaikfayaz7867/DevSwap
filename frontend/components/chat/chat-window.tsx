'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useMessages, useSendMessage } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useAuthStore } from '@/store/auth-store';

export function ChatWindow({ matchId, receiverId }: { matchId: string; receiverId: string }) {
  const { data } = useMessages(matchId);
  const sendMutation = useSendMessage();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [text, setText] = useState('');
  const user = useAuthStore((s) => s.user);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !matchId) return;
    socket.emit('room:join', matchId);

    socket.on('chat:typing', () => setIsTyping(true));
    socket.on('chat:stopTyping', () => setIsTyping(false));
    socket.on('chat:newMessage', (newMessage) => {
      // Update the messages query cache with the new message
      queryClient.setQueryData(
        ['messages', token, matchId],
        (old: any) => ({
          ...old,
          messages: [...(old?.messages || []), newMessage],
        })
      );
    });

    return () => {
      socket.off('chat:typing');
      socket.off('chat:stopTyping');
      socket.off('chat:newMessage');
    };
  }, [socket, matchId, token, queryClient]);

  return (
    <div className="flex h-[70vh] flex-col rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl">
      <div className="border-b border-border/70 px-4 py-3 text-sm text-foreground/65">Live chat</div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {data?.messages?.map((m) => (
          <div
            key={m._id}
            className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-[0_8px_24px_-18px_rgba(0,0,0,0.9)] ${m.sender._id === user?._id ? 'ml-auto bg-gradient-to-br from-primary to-accent text-white' : 'bg-muted/80'}`}
          >
            {m.message}
          </div>
        ))}
        {isTyping ? <p className="text-xs text-foreground/60">Typing...</p> : null}
      </div>
      <form
        className="flex gap-2 border-t border-border/70 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMutation.mutate({ matchId, receiverId, message: text });
          socket?.emit('chat:stopTyping', { roomId: matchId, userId: user?._id });
          setText('');
        }}
      >
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket?.emit('chat:typing', { roomId: matchId, userId: user?._id });
          }}
          placeholder="Write a message"
        />
        <Button className="px-5">Send</Button>
      </form>
    </div>
  );
}
