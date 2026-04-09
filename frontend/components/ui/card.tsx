import { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'surface glow-effect rounded-3xl p-1', // Glow effect needs relative parent and adds before element
        className,
      )}
      {...props}
    >
      <div className="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-card border border-white/5 p-6 backdrop-blur-xl">
        {props.children}
      </div>
    </div>
  );
}
