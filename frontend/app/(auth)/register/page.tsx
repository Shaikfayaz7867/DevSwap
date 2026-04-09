'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterFormValues } from '@/lib/validators';
import { useRegister } from '@/hooks/use-auth';

export default function RegisterPage() {
  const router = useRouter();
  const mutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    router.push('/onboarding');
  });

  return (
    <div>
      <p className="mb-2 inline-flex rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-foreground/70">Create account</p>
      <h1 className="font-display text-3xl font-bold">Create DevSwap account</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/70">Join a focused network of developers.</p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Input placeholder="Full name" {...register('name')} />
          {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
        </div>
        <div>
          <Input placeholder="Email" {...register('email')} />
          {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
        </div>
        <div>
          <Input type="password" placeholder="Password" {...register('password')} />
          {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
        </div>
        <Button className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-foreground/70">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
