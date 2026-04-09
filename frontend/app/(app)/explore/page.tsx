'use client';

import { useQuery } from '@tanstack/react-query';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getExplore } from '@/services/explore-service';
import { useAuthStore } from '@/store/auth-store';

export default function ExplorePage() {
  const token = useAuthStore((s) => s.token);
  const { data } = useQuery({
    queryKey: ['explore', token],
    queryFn: () => getExplore(token || ''),
    enabled: Boolean(token),
  });

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-2xl font-bold">Popular tags</h2>
        <div className="flex flex-wrap gap-2">
          {(data?.popularTags || []).map((tag) => (
            <Badge key={tag.tag} className="text-sm">
              #{tag.tag} ({tag.count})
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-2xl font-bold">Top users</h2>
        <div className="space-y-2">
          {(data?.topUsers || []).map((user) => (
            <div key={user._id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/40 p-3">
              <Avatar src={user.profileImage} alt={user.name} />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-foreground/70">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
