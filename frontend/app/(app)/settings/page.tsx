'use client';

import { useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useMarkNotificationRead, useNotifications } from '@/hooks/use-notifications';

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-xs text-foreground/70">Dark mode is default. Toggle anytime.</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Push notifications</p>
            <p className="text-xs text-foreground/70">Messages, matches, and post updates.</p>
          </div>
          <Switch checked={pushEnabled} onChange={setPushEnabled} />
        </div>
      </Card>

      <Card className="p-5" id="notifications">
        <h2 className="mb-3 font-semibold">Recent notifications</h2>
        <div className="space-y-2">
          {(data?.notifications || []).map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 p-3">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-foreground/65">{item.body}</p>
              </div>
              {!item.read ? (
                <Button size="sm" variant="secondary" onClick={() => markRead.mutate(item._id)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
