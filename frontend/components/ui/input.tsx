import { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-white/10 bg-background/50 px-4 text-sm font-medium outline-none transition-all duration-300 placeholder:text-foreground/45 focus:border-primary/60 focus:bg-background/80 focus:shadow-[0_0_20px_-5px_hsl(var(--primary)/30%)] focus:ring-1 focus:ring-primary/50',
        className,
      )}
      {...props}
    />
  );
}
