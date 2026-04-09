'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { TagInput } from '@/components/forms/tag-input';
import { Stepper } from '@/components/onboarding/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { onboardingSchema, type OnboardingFormValues } from '@/lib/validators';
import { completeOnboardingRequest } from '@/services/onboarding-service';
import { useAuthStore } from '@/store/auth-store';
import { useUiStore } from '@/store/ui-store';

export default function OnboardingPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);
  const step = useUiStore((s) => s.onboardingStep);
  const setStep = useUiStore((s) => s.setOnboardingStep);

  const { register, watch, setValue, handleSubmit } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      certifications: [],
      skillsOffered: [],
      skillsWanted: [],
      preferences: {
        openToMentoring: true,
        preferredExperienceLevels: [],
        preferredSkills: [],
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (values: OnboardingFormValues) => completeOnboardingRequest(token || '', values),
    onSuccess: (data) => {
      if (token) setSession(token, data.user);
      router.push('/home');
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="surface mb-4 p-6">
        <p className="mb-2 inline-flex rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-foreground/70">Onboarding</p>
        <h1 className="font-display text-3xl font-bold">Complete your DevSwap profile</h1>
        <p className="mt-1 text-sm text-foreground/70">This helps us build better developer matches.</p>
      </div>

      <Stepper current={step} total={4} />

      <form className="surface space-y-5 p-6" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        {step === 1 ? (
          <>
            <Input placeholder="Full name" {...register('name')} />
            <Input placeholder="Profile image URL" {...register('profileImage')} />
            <Input placeholder="Role (Frontend Dev, etc)" {...register('role')} />
            <Input placeholder="Experience level" {...register('experience')} />
            <Input placeholder="Company" {...register('company')} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <TagInput
              value={watch('skillsOffered') || []}
              onChange={(next) => setValue('skillsOffered', next)}
              placeholder="Skill you can offer"
            />
            <TagInput
              value={watch('skillsWanted') || []}
              onChange={(next) => setValue('skillsWanted', next)}
              placeholder="Skill you want to learn"
            />
            <TagInput
              value={watch('certifications') || []}
              onChange={(next) => setValue('certifications', next)}
              placeholder="Certification"
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Input placeholder="GitHub URL" {...register('github')} />
            <Input placeholder="Portfolio URL" {...register('portfolio')} />
            <Textarea placeholder="Short bio" {...register('bio')} />
            <Textarea placeholder="Learning goals" {...register('goals')} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <TagInput
              value={watch('preferences.preferredSkills') || []}
              onChange={(next) => setValue('preferences.preferredSkills', next)}
              placeholder="Preferred skills"
            />
            <TagInput
              value={watch('preferences.preferredExperienceLevels') || []}
              onChange={(next) => setValue('preferences.preferredExperienceLevels', next)}
              placeholder="Preferred experience level"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('preferences.openToMentoring')} /> Open to mentoring
            </label>
          </>
        ) : null}

        <div className="flex justify-between border-t border-border/70 pt-2">
          <Button type="button" variant="secondary" onClick={() => setStep(Math.max(1, step - 1))}>
            Back
          </Button>
          {step < 4 ? (
            <Button type="button" onClick={() => setStep(Math.min(4, step + 1))}>
              Next
            </Button>
          ) : (
            <Button disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Finish onboarding'}</Button>
          )}
        </div>
      </form>
    </div>
  );
}
