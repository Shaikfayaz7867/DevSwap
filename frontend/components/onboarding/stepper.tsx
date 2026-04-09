export function Stepper({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6 space-y-2 rounded-2xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-center justify-between text-xs text-foreground/70">
        <span>
          Step {current} of {total}
        </span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/90">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
