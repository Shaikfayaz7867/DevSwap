'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle, BookOpen, Layers3, ShieldCheck, Zap, Code2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4, duration: 0.8 } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Immersive Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[150px] mix-blend-screen pointer-events-none" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 sm:pt-32 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_hsl(var(--primary)/20%)] animate-pulse-glow">
              <Sparkles className="h-4 w-4" /> Next-gen Developer Networking
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl mb-8">
            Swap skills with <br className="hidden sm:block" />
            <span className="text-gradient-animate drop-shadow-2xl">elite developers.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-10">
            A radical new platform blending swipe-based matching, markdown-first learning feeds, and real-time collaboration. Built specifically for engineers.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                <Zap className="mr-2 h-5 w-5" /> Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-base">
                View Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]"
        >
          {/* Large Featured Card */}
          <Card className="md:col-span-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Layers3 className="h-10 w-10 text-primary mb-6" />
            <h3 className="font-display text-2xl font-bold mb-3 text-foreground">Advanced Compatibility Engine</h3>
            <p className="text-muted-foreground max-w-md">Our algorithm analyzes your tech stack, experience level, and learning goals to surface perfect mentorship and collaboration matches.</p>
            <div className="mt-8 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-primary/80">
              <code>matching_score = sum(overlap(skills)) * exp_weight</code>
            </div>
          </Card>

          <Card className="group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <MessageCircle className="h-10 w-10 text-accent mb-6" />
              <h3 className="font-display text-xl font-bold mb-3">Real-time Chat & WebSockets</h3>
              <p className="text-muted-foreground text-sm">Instant messaging powered by Socket.IO with typing indicators and online presence.</p>
            </div>
            <div className="mt-6 flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted animate-pulse" style={{ animationDelay: `${i*150}ms` }} />
              ))}
            </div>
          </Card>

          <Card className="group relative overflow-hidden">
            <BookOpen className="h-10 w-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-display text-xl font-bold mb-3">Markdown Feed</h3>
            <p className="text-muted-foreground text-sm mb-4">Share code snippets and tutorials with full markdown support, syntax highlighting, and tags.</p>
          </Card>

          <Card className="md:col-span-2 group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
            <ShieldCheck className="h-10 w-10 text-primary mb-6 relative z-10" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl font-bold mb-3 text-foreground">Enterprise-Grade Architecture</h3>
                <p className="text-muted-foreground">Built on Next.js App Router, combining server components with highly interactive client experiences.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 rounded-xl bg-black/40 border border-white/5 p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">jwt</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Auth</div>
                </div>
                <div className="flex-1 rounded-xl bg-black/40 border border-white/5 p-4 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">Zustand</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">State</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
