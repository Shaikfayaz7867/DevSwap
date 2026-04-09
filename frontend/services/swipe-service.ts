import { apiRequest } from '@/services/api';
import { SwipeCandidate } from '@/types';

export const getCandidates = (token: string) =>
  apiRequest<{ candidates: SwipeCandidate[] }>('/swipes/candidates', { token });

export const swipeAction = (token: string, payload: { targetUserId: string; action: 'like' | 'skip' }) =>
  apiRequest<{ matchCreated: boolean }>('/swipes', { method: 'POST', token, body: payload });
