'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { loginRequest, meRequest, registerRequest } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';

export const useRegister = () => {
  const { setSession } = useAuthStore();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => setSession(data.token, data.user),
  });
};

export const useLogin = () => {
  const { setSession } = useAuthStore();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => setSession(data.token, data.user),
  });
};

export const useAuthMe = () => {
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);

  return useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      if (!token) return null;
      const data = await meRequest(token);
      setSession(token, data.user);
      return data.user;
    },
    enabled: Boolean(token),
  });
};
