'use client';

import { useEffect, useRef, useState } from 'react';

import { Paperclip, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useMessages, useSendMessage } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useAuthStore } from '@/store/auth-store';
import { uploadFile } from '@/services/upload-service';
import { cn } from '@/utils/cn';
import { AuthUser } from '@/types';

export function ChatWindow({ matchId, receiver }: { matchId: string; receiver: AuthUser }) {
  const { data } = useMessages(matchId);
  const sendMutation = useSendMessage();
  const { socket, onlineUsers } = useSocket();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [text, setText] = useState('');
  const user = useAuthStore((s) => s.user);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const receiverStatus = onlineUsers[receiver._id] || { isOnline: receiver.isOnline, lastSeenAt: (receiver as any).lastSeenAt };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.messages, isTyping, isUploading]);

  useEffect(() => {
    if (!socket || !matchId) return;
    socket.emit('room:join', matchId);

    socket.on('chat:typing', ({ userId }) => {
      if (userId === receiver._id) setIsTyping(true);
    });

    socket.on('chat:stopTyping', ({ userId }) => {
      if (userId === receiver._id) setIsTyping(false);
    });

    socket.on('chat:newMessage', (newMessage) => {
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
  }, [socket, matchId, token, queryClient, receiver._id]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    sendMutation.mutate({ matchId, receiverId: receiver._id, message: text });
    socket?.emit('chat:stopTyping', { roomId: matchId, userId: user?._id });
    setText('');
  };

  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return 'Offline';
    const date = new Date(dateString);
    return `Last seen ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-3xl border border-border/80 bg-card/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-background/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
              receiverStatus.isOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-500"
            )} />
            <div className="h-10 w-10 rounded-full border border-border/50 overflow-hidden">
              <img src={receiver.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver.name}`} alt={receiver.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight leading-none">{receiver.name}</h3>
            <p className="text-[10px] font-medium text-foreground/45 mt-1">
              {receiverStatus.isOnline ? (
                <span className="text-green-500 uppercase tracking-widest font-bold">Online</span>
              ) : (
                formatLastSeen(receiverStatus.lastSeenAt)
              )}
            </p>
          </div>
        </div>
        <span className="hidden md:block text-[10px] uppercase font-bold text-foreground/45 tracking-widest">DevSwap Direct</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-6 scroll-smooth"
      >
        {data?.messages?.map((m: any, idx: number) => {
          const isMe = m.sender._id === user?._id;
          return (
            <div
              key={m._id || idx}
              className={cn(
                "group flex flex-col max-w-[85%] space-y-1 transition-all duration-300",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "relative rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-transform",
                  isMe
                    ? "bg-gradient-to-br from-primary to-accent text-white rounded-tr-none hover:scale-[1.02]"
                    : "bg-muted/80 backdrop-blur-sm rounded-tl-none hover:scale-[1.02] border border-border/50"
                )}
              >
                {m.fileUrl && (
                  <div className="mb-2 overflow-hidden rounded-lg">
                    {m.fileUrl.toLowerCase().endsWith('.pdf') ? (
                      <a href={m.fileUrl} target="_blank" rel="noreferrer" download className="flex items-center gap-3 bg-black/20 p-3 text-white transition hover:bg-black/30">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-mono">DOCUMENT.PDF</span>
                          <span className="text-[10px] opacity-60">Tap to download</span>
                        </div>
                      </a>
                    ) : (
                      <img
                        src={m.fileUrl}
                        alt="attachment"
                        className="max-h-64 h-auto w-full object-cover cursor-zoom-in"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                {m.message ? <div className="leading-relaxed font-medium">{m.message}</div> : null}
              </div>
              <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-tighter px-1">
                {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        {isTyping ? (
          <div className="flex items-center gap-2 p-1">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest">{receiver.name} is typing</span>
          </div>
        ) : null}
        {isUploading ? (
          <div className="flex items-center gap-2 ml-auto p-1">
            <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest">Sending file...</span>
          </div>
        ) : null}
      </div>

      <div className="p-4 bg-background/60 backdrop-blur-xl border-t border-border/70">
        <form
          className="flex items-center gap-2"
          onSubmit={handleSend}
        >
          <label className={cn(
            "flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-muted/50 text-foreground/70 transition-all border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30",
            isUploading && "opacity-50 cursor-not-allowed"
          )}>
            <input
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              disabled={isUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && token) {
                  setIsUploading(true);
                  try {
                    const url = await uploadFile(token, file);
                    sendMutation.mutate({ matchId, receiverId: receiver._id, message: '', fileUrl: url });
                  } catch (err: any) {
                    console.error('File upload failed', err);
                    alert(err.message || 'File upload failed');
                  } finally {
                    setIsUploading(false);
                    e.target.value = '';
                  }
                }
              }}
            />
            <Paperclip className="h-5 w-5" />
          </label>
          <div className="relative flex-1 group">
            <Input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                socket?.emit('chat:typing', { roomId: matchId, userId: user?._id });
              }}
              onBlur={() => socket?.emit('chat:stopTyping', { roomId: matchId, userId: user?._id })}
              placeholder="Start typing..."
              className="h-12 bg-muted/30 border-border/50 focus:bg-background/80 pr-12 transition-all rounded-2xl shadow-none"
            />
            <Button
              type="submit"
              disabled={!text.trim() || sendMutation.isPending}
              size="sm"
              className={cn(
                "absolute right-1 top-1 h-10 w-10 rounded-xl p-0 transition-all grow-0",
                text.trim() ? "bg-primary opacity-100 translate-x-0 scale-100" : "bg-transparent opacity-0 translate-x-2 scale-50 pointer-events-none"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
