'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMessages, sendMessage } from '@/services/chat-service';
import { useAuthStore } from '@/store/auth-store';

export function useMessages(matchId: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['messages', token, matchId],
    queryFn: () => getMessages(token || '', matchId),
    enabled: Boolean(token && matchId),
  });
}

export function useSendMessage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { matchId: string; receiverId: string; message: string }) =>
      sendMessage(token || '', payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', token, variables.matchId] });
    },
  });
}
