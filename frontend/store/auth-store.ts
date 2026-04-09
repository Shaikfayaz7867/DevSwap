import { create } from 'zustand';

import { AuthUser } from '@/types';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

const TOKEN_KEY = 'devswap-token';
const USER_KEY = 'devswap-user';

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(USER_KEY) || 'null') : null,
  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));
