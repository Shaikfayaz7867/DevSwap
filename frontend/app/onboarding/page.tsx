'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { AuthGuard } from '@/components/auth/auth-guard';
import { TagInput } from '@/components/forms/tag-input';
import { Stepper } from '@/components/onboarding/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { onboardingSchema, type OnboardingFormValues } from '@/lib/validators';
import { completeOnboardingRequest } from '@/services/onboarding-service';
import { useAuthStore } from '@/store/auth-store';
import { useUiStore } from '@/store/ui-store';
import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadFile } from '@/services/upload-service';

export default function OnboardingPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);
  const step = useUiStore((s) => s.onboardingStep);
  const setStep = useUiStore((s) => s.setOnboardingStep);
  const [isUploading, setIsUploading] = useState(false);

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
    <AuthGuard>
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
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
                  {watch('profileImage') ? (
                    <img src={watch('profileImage')} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-foreground/20" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && token) {
                        setIsUploading(true);
                        try {
                          const url = await uploadFile(token, file);
                          setValue('profileImage', url);
                        } catch (err: any) {
                          alert(err.message || 'Upload failed');
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                  <Camera className="h-4 w-4" />
                </label>
              </div>
              <p className="mt-4 text-xs font-medium text-foreground/50 uppercase tracking-widest">Profile Photo</p>
            </div>
            <Input placeholder="Full name" {...register('name')} />
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
    </AuthGuard>
  );
}
