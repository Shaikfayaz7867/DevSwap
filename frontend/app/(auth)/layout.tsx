export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-2">
      <div className="surface hidden p-8 md:block">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/55">Welcome to DevSwap</p>
        <h2 className="font-display text-4xl font-bold leading-tight">Find devs who can teach what you need to learn next.</h2>
        <p className="mt-4 text-sm text-foreground/70">
          Swipe by skill compatibility, share markdown learning posts, and collaborate in real-time with focused builders.
        </p>
      </div>

      <div className="surface w-full p-6 md:p-8">{children}</div>
    </div>
  );
}
