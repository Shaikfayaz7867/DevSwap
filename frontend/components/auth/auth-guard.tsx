'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const initialize = useAuthStore((s: any) => s.initialize);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
    setIsMounted(true);
  }, [initialize]);

  useEffect(() => {
    if (!isMounted) return;

    if (!token) {
      if (pathname !== '/login' && pathname !== '/register') {
        router.replace('/login');
      }
      return;
    }

    if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [token, user, router, isMounted, pathname]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="p-8 glass rounded-2xl text-center">
          <p className="text-sm font-medium text-foreground/70">Secure session initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
