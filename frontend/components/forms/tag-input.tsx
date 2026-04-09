'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInput('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" onClick={addTag} variant="secondary" className="px-4">
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} className="gap-1.5">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
