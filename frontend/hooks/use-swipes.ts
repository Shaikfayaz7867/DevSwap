'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCandidates, swipeAction } from '@/services/swipe-service';
import { useAuthStore } from '@/store/auth-store';

export function useSwipeCandidates() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['swipe-candidates', token],
    queryFn: () => getCandidates(token || ''),
    enabled: Boolean(token),
  });
}

export function useSwipeAction() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { targetUserId: string; action: 'like' | 'skip' }) =>
      swipeAction(token || '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swipe-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
