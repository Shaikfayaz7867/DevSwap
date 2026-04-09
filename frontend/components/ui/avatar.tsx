import Image from 'next/image';

import { cn } from '@/utils/cn';

export function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/80 text-xs font-semibold uppercase shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)]',
          className,
        )}
      >
        {alt.slice(0, 2)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={cn('h-10 w-10 rounded-full border border-border/70 object-cover shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)]', className)}
    />
  );
}
