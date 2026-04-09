'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getNotifications, markNotificationRead } from '@/services/notification-service';
import { useAuthStore } from '@/store/auth-store';

export function useNotifications() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['notifications', token],
    queryFn: () => getNotifications(token || ''),
    enabled: Boolean(token),
  });
}

export function useMarkNotificationRead() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(token || '', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', token] }),
  });
}
