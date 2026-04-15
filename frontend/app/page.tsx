'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  BookOpen,
  Layers3,
  ShieldCheck,
  Zap,
  Cpu,
  MoonStar,
  Users,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';

export default function LandingPage() {
  const featureCards = [
    {
      icon: Layers3,
      title: 'Compatibility-driven matching',
      description:
        'Match with developers based on exact skills offered, skills wanted, experience band, and collaboration goals.',
    },
    {
      icon: MessageCircle,
      title: 'Live conversations',
      description:
        'Move from match to project quickly with real-time chat, typing indicators, and online presence.',
    },
    {
      icon: BookOpen,
      title: 'Knowledge feed that compounds',
      description:
        'Publish markdown posts, attach resources, and build your technical reputation over time.',
    },
  ];

  const steps = [
    {
      title: 'Build profile precision',
      body: 'Complete onboarding with your current stack, desired stack, and role goals.',
    },
    {
      title: 'Swipe high-fit developers',
      body: 'Your home feed prioritizes people who can truly trade skills and momentum.',
    },
    {
      title: 'Start collaboration loops',
      body: 'Use chat + feed posts to learn in public and execute projects together faster.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute left-[-12%] top-[-12%] h-[24rem] w-[24rem] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:3.25rem_3.25rem] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
              D
            </span>
            <span className="text-gradient">{APP_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/75 md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#workflow" className="transition hover:text-foreground">Workflow</a>
            <a href="#trust" className="transition hover:text-foreground">Architecture</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 lg:px-8 lg:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Built for developers who ship
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              The fastest way to
              <span className="block text-gradient-animate"> find your next technical collaborator.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
              {APP_NAME} combines skill-based matching, a learning feed, and real-time chat so developers can mentor,
              pair, and build products together without the networking noise.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Zap className="h-5 w-5" /> Create free account
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Open platform <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-primary/25 via-accent/15 to-primary/25 blur-2xl" />
            <Image
              src="/hero-collab.svg"
              alt="DevSwap collaboration dashboard preview"
              width={960}
              height={720}
              priority
              className="relative rounded-[2rem] border border-white/10 shadow-2xl"
            />
          </motion.div>
        </section>

        <section id="features" className="mt-24 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Product highlights</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Everything you need to network and execute</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-foreground/65 md:inline-flex">
              <MoonStar className="h-3.5 w-3.5" /> Dark + light mode ready
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="group h-full p-0">
                  <div className="h-full rounded-[calc(1.5rem-2px)] border border-transparent bg-card/95 p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/25">
                    <div className="mb-5 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/70">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-24 grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">How it works</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">From profile to partnership in minutes</h2>
            <p className="text-sm leading-7 text-foreground/72 sm:text-base">
              Keep the workflow simple: define your strengths, discover right-fit developers, and start shipping together.
            </p>

            <div className="space-y-3 pt-2">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="group rounded-2xl border border-border/70 bg-card/65 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/35"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step {index + 1}</p>
                  <h3 className="mt-1 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/68">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          <Image
            src="/feed-preview.svg"
            alt="Feed and collaboration workflow preview"
            width={800}
            height={560}
            className="w-full rounded-[2rem] border border-white/10 shadow-2xl"
          />
        </section>

        <section id="trust" className="mt-24 grid gap-5 md:grid-cols-3">
          <Card className="group h-full p-0 md:col-span-2">
            <div className="h-full rounded-[calc(1.5rem-2px)] border border-transparent bg-card/95 p-6 transition group-hover:border-primary/25">
              <div className="mb-4 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-bold">Built for production and scale</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/70">
                Secure auth, request validation, API rate limiting, profile completeness logic, and socket-based real-time
                messaging are already integrated in the platform architecture.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <Cpu className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-foreground/55">Stack</p>
                  <p className="mt-1 text-sm font-medium">Next.js + Express</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <Workflow className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-foreground/55">Realtime</p>
                  <p className="mt-1 text-sm font-medium">Socket.IO channels</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-foreground/55">Readiness</p>
                  <p className="mt-1 text-sm font-medium">PWA + API health</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group h-full p-0">
            <div className="h-full rounded-[calc(1.5rem-2px)] border border-transparent bg-card/95 p-6 transition-all group-hover:-translate-y-1 group-hover:border-primary/30">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold">Community-first growth</h3>
              <p className="mt-2 text-sm text-foreground/68">
                Replace random networking with quality matches and shared learning loops.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Skill exchange focused</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Mentor + peer collaborations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Portfolio building through posts</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="mt-24 rounded-[2rem] border border-border/70 bg-card/70 px-6 py-10 text-center shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Launch your developer network</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Ready to make {APP_NAME} your growth engine?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
            Start with onboarding and build your first high-quality match today.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg">Create account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Continue to app <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-border/60 pt-6 text-sm text-foreground/60">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} {APP_NAME}. Built for developers shipping together.</p>
            <div className="flex gap-4">
              <Link href="/login" className="transition hover:text-foreground">Login</Link>
              <Link href="/register" className="transition hover:text-foreground">Register</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
