'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: Record<string, { isOnline: boolean; lastSeenAt?: string }>;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, { isOnline: boolean; lastSeenAt?: string }>>({});

  const socket = useMemo(() => {
    if (!token || !user?._id) return null;

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId: user._id },
    });

    return socketInstance;
  }, [token, user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('presence:online', user._id);
    });

    socket.on('presence:update', ({ userId, isOnline, lastSeenAt }: { userId: string; isOnline: boolean; lastSeenAt?: string }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: { isOnline, lastSeenAt },
      }));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      // We don't necessarily want to disconnect here if the socket is shared,
      // but since it's managed by useMemo tied to the token/user, 
      // it will handle reconnection on its own if those change.
      socket.off('presence:update');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
