import { apiRequest } from '@/services/api';
import { Match } from '@/types';

export const getMatches = (token: string) => apiRequest<{ matches: Match[] }>('/matches', { token });
