'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './socket-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="devswap-theme">
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <SocketProvider>{children}</SocketProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
