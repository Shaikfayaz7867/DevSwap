import { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        className,
      )}
      {...props}
    />
  );
}
