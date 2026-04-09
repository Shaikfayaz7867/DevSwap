'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Compass, House, LogOut, MessageSquare, Settings, UserRound, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { NAV_LINKS } from '@/lib/constants';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuthStore } from '@/store/auth-store';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/utils/cn';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  '/home': House,
  '/feed': Compass,
  '/matches': Users,
  '/chat': MessageSquare,
  '/profile': UserRound,
  '/settings': Settings,
  '/explore': Compass,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const { data } = useNotifications();
  const unread = data?.notifications?.some((n) => !n.read);

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative z-0">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/50 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/home" className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight group">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl overflow-hidden shadow-[0_0_15px_-3px_hsl(var(--primary)/50%)] group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary animate-shimmer bg-[length:200%_auto] opacity-90" />
              <span className="relative z-10 text-white font-bold text-sm">D</span>
            </div>
            <span className="text-gradient">DevSwap</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              className="relative rounded-xl border border-white/10 bg-black/20 p-2.5 transition hover:border-primary/40 hover:bg-white/5 hover:shadow-[0_0_15px_-3px_hsl(var(--primary)/30%)]"
              onClick={() => router.push('/settings#notifications')}
              type="button"
            >
              <Bell className="h-4 w-4" />
              {unread ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" /> : null}
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-black/20 p-2.5 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 group"
              onClick={() => {
                clearSession();
                router.push('/login');
              }}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8">
        <aside className="sticky top-24 hidden h-fit w-64 space-y-4 md:block shrink-0">
          <nav className="glass rounded-2xl p-3 flex flex-col gap-1 relative shadow-2xl shadow-primary/5">
            {NAV_LINKS.map((item) => {
              const Icon = ICON_MAP[item.href] || House;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                    isActive ? 'text-white' : 'text-foreground/70 hover:text-foreground hover:bg-white/5',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-glow"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("h-4 w-4 relative z-10 transition-transform duration-300", isActive ? "text-primary scale-110" : "group-hover:scale-110")} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="animated-border">
            <div className="surface p-5 relative z-10">
              <p className="text-sm font-semibold text-foreground tracking-wide">{user?.name || 'Developer'}</p>
              <div className="mt-3 relative h-1.5 rounded-full bg-black/40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, user?.profileCompletion || 0)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_hsl(var(--primary))]"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-foreground/50">Profile Details <span className="text-white/80">{user?.profileCompletion || 0}%</span></p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 animate-fade-up">
          {children}
        </section>
      </main>

      {/* Floating Modern Mobile Nav */}
      <nav className="fixed inset-x-4 bottom-5 z-50 md:hidden">
        <div className="glass rounded-2xl p-2 mx-auto max-w-sm flex justify-around items-center shadow-[0_20px_40px_-5px_hsl(var(--primary)/15%)] border-t border-white/20">
          {NAV_LINKS.slice(0, 5).map((item) => {
            const Icon = ICON_MAP[item.href] || House;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300',
                  isActive ? 'text-white' : 'text-foreground/50 hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-glow"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/20 to-transparent border-t border-primary/40 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary filter drop-shadow-[0_0_8px_hsl(var(--primary))]" : "")} />
                {isActive && <span className="text-[10px] font-medium opacity-80">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
