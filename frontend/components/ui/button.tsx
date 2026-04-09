import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_20px_-5px_hsl(var(--primary)/40%)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/60%)] border border-white/20',
        secondary: 'glass text-foreground hover:bg-white/5 hover:border-primary/50',
        ghost: 'text-foreground/80 hover:bg-white/5 hover:text-foreground',
        danger: 'bg-red-500/90 text-white hover:bg-red-500 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-xl px-4',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {/* Optional shiny reflection effect on default button */}
      {variant === 'default' && (
        <span className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
    </button>
  );
}
