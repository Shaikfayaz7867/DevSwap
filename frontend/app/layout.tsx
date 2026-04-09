import type { Metadata } from 'next';

import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';

export const metadata: Metadata = {
  title: 'DevSwap - Match, Learn, Build',
  description:
    'DevSwap is a developer-only platform for skill-based matching, learning feed discovery, and real-time collaboration chat.',
  keywords: ['DevSwap', 'developers', 'matching', 'learning feed', 'chat', 'PWA'],
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
