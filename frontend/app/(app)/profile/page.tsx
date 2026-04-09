'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getMyProfile, updateProfile } from '@/services/user-service';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const token = useAuthStore((s) => s.token);
  const { data, refetch } = useQuery({
    queryKey: ['profile', token],
    queryFn: () => getMyProfile(token || ''),
    enabled: Boolean(token),
  });

  const user = data?.user;
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => updateProfile(token || '', { 
      bio, 
      ...(github ? { github } : {})
    }),
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.profileImage} alt={user?.name || 'User'} className="h-16 w-16" />
          <div>
            <h1 className="font-display text-3xl font-bold">{user?.name}</h1>
            <p className="text-sm text-foreground/70">{user?.role || 'Developer'}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-foreground/55">GitHub</p>
            <Input
              defaultValue={user?.github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-foreground/55">Bio</p>
            <Textarea
              defaultValue={user?.bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell about yourself"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={() => saveMutation.mutate()}>
          Save profile
        </Button>
      </Card>

      <Card className="p-5">
        <h2 className="mb-2 font-semibold">Skills Offered</h2>
        <div className="flex flex-wrap gap-2">
          {(user?.skillsOffered || []).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-2 font-semibold">Certifications</h2>
        <ul className="list-disc space-y-1 pl-6 text-sm text-foreground/80">
          {(user?.certifications || []).map((cert) => (
            <li key={cert}>{cert}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="mb-2 font-semibold">Recent Posts</h2>
        <div className="space-y-2">
          {(data?.posts || []).map((post) => (
            <div key={post._id} className="rounded-2xl border border-border/70 bg-background/40 p-3">
              <p className="font-semibold leading-tight">{post.title}</p>
              <p className="line-clamp-2 text-sm text-foreground/70">{post.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
