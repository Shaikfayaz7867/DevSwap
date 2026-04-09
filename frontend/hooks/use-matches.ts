'use client';

import { useQuery } from '@tanstack/react-query';

import { getMatches } from '@/services/match-service';
import { useAuthStore } from '@/store/auth-store';

export function useMatches() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['matches', token],
    queryFn: () => getMatches(token || ''),
    enabled: Boolean(token),
  });
}
