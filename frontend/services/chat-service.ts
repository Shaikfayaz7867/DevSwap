import { apiRequest } from '@/services/api';
import { Message } from '@/types';

export const getMessages = (token: string, matchId: string) =>
  apiRequest<{ messages: Message[] }>(`/chat/messages/${matchId}`, { token });

export const sendMessage = (token: string, payload: { matchId: string; receiverId: string; message: string; fileUrl?: string }) =>
  apiRequest<{ message: Message }>('/chat/messages', { method: 'POST', token, body: payload });
