'use client';

import { cn } from '@/utils/cn';

export function Switch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full border transition-all duration-300',
        checked ? 'border-primary/60 bg-primary/80' : 'border-border/70 bg-muted',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300',
          checked ? 'left-5' : 'left-0.5',
        )}
      />
    </button>
  );
}
