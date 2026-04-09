'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { useLogin } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const mutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    router.push('/home');
  });

  return (
    <div>
      <p className="mb-2 inline-flex rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-foreground/70">Sign in</p>
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/70">Log in to continue building with developers.</p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Input placeholder="Email" {...register('email')} />
          {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
        </div>
        <div>
          <Input type="password" placeholder="Password" {...register('password')} />
          {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
        </div>
        <Button className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-foreground/70">
        New to DevSwap?{' '}
        <Link href="/register" className="font-semibold text-primary">
          Create account
        </Link>
      </p>
    </div>
  );
}
