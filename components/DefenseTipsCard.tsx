'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefenseTipsCardProps {
  tips: string[];
}

export function DefenseTipsCard({ tips }: DefenseTipsCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!tips || tips.length === 0) return null;

  return (
    <Card className="overflow-hidden border-red-700/60 bg-red-950/40 transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <CardHeader className="hover:bg-red-900/40 transition-colors py-4">
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {tips.length}
            </span>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-snug text-red-200">
                Defense and Counter Arguments
              </CardTitle>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-red-300 flex-shrink-0 transition-transform mt-1',
                expanded && 'rotate-180'
              )}
            />
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-6 border-t border-red-700/40 bg-red-950/60">
          <ul className="pt-4 space-y-3">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-red-100 leading-relaxed">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600/50 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
