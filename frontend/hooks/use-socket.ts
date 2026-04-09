'use client';

import { useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function useSocket(): Socket | null {
  const user = useAuthStore((state) => state.user);

  const socket = useMemo(() => {
    if (!user?._id) return null;
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId: user._id },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return socketInstance;
  }, [user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit('presence:online', user._id);

    return () => {
      socket.disconnect();
    };
  }, [socket, user?._id]);

  return socket;
}
