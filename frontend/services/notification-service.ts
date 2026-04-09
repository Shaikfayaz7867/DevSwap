import { apiRequest } from '@/services/api';
import { NotificationItem } from '@/types';

export const getNotifications = (token: string) =>
  apiRequest<{ notifications: NotificationItem[] }>('/notifications', { token });

export const markNotificationRead = (token: string, id: string) =>
  apiRequest<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST', token });
