'use client';

import { useState } from 'react';
import { ArgumentItem, EvidenceItem, EvidenceType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArgumentAccordionProps {
  argument: ArgumentItem;
  index: number;
}

const EVIDENCE_LABELS: Record<EvidenceType, string> = {
  scripture: 'Biblical Foundation',
  scientific: 'Scientific Evidence',
  historical: 'Historical Evidence',
  philosophical: 'Philosophical Support',
  practical: 'Practical Reasoning',
  constitutional: 'Constitutional Foundation',
  quote: 'Notable Quote',
};

const EVIDENCE_STYLES: Record<EvidenceType, string> = {
  scripture: 'border-l-4 border-primary bg-primary/10',
  scientific: 'border-l-4 border-blue-400 bg-blue-400/10',
  historical: 'border-l-4 border-amber-400 bg-amber-400/10',
  philosophical: 'border-l-4 border-purple-400 bg-purple-400/10',
  practical: 'border-l-4 border-green-400 bg-green-400/10',
  constitutional: 'border-l-4 border-accent bg-accent/10',
  quote: 'border-l-4 border-muted-foreground bg-muted-foreground/10',
};

const EVIDENCE_LABEL_STYLES: Record<EvidenceType, string> = {
  scripture: 'text-primary',
  scientific: 'text-blue-300',
  historical: 'text-amber-300',
  philosophical: 'text-purple-300',
  practical: 'text-green-300',
  constitutional: 'text-accent',
  quote: 'text-muted-foreground',
};

function EvidenceBlock({ item }: { item: EvidenceItem }) {
  const style = EVIDENCE_STYLES[item.type] ?? 'border-l-4 border-border bg-muted/30';
  const labelStyle = EVIDENCE_LABEL_STYLES[item.type] ?? 'text-muted-foreground';
  const typeLabel = EVIDENCE_LABELS[item.type] ?? item.type;

  return (
    <div className={cn('rounded-r-lg p-4', style)}>
      <div className={cn('text-xs font-bold uppercase tracking-wider mb-1', labelStyle)}>
        {typeLabel}
      </div>
      {item.title && (
        <div className="font-semibold text-sm text-foreground mb-2">{item.title}</div>
      )}
      <p className="text-sm text-foreground leading-relaxed italic">{item.content}</p>
      {item.citation && (
        <p className="text-xs text-muted-foreground mt-2">— {item.citation}</p>
      )}
    </div>
  );
}

// Subtle tinted header backgrounds cycling across 5 professional accent tones
const ARG_ACCENT_HEADER: string[] = [
  'bg-[oklch(0.38_0.08_25)]  border-l-4 border-[oklch(0.65_0.22_25)]',   // warm red-orange (primary)
  'bg-[oklch(0.38_0.07_240)] border-l-4 border-[oklch(0.60_0.16_240)]',  // steel blue
  'bg-[oklch(0.37_0.07_160)] border-l-4 border-[oklch(0.58_0.14_160)]',  // teal-green
  'bg-[oklch(0.38_0.07_55)]  border-l-4 border-[oklch(0.65_0.16_55)]',   // amber-gold
  'bg-[oklch(0.37_0.07_285)] border-l-4 border-[oklch(0.58_0.15_285)]',  // soft violet
];

const ARG_ACCENT_NUMBER: string[] = [
  'bg-[oklch(0.65_0.22_25)]  text-white',   // orange-red
  'bg-[oklch(0.60_0.16_240)] text-white',   // steel blue
  'bg-[oklch(0.58_0.14_160)] text-white',   // teal-green
  'bg-[oklch(0.65_0.16_55)]  text-white',   // amber-gold
  'bg-[oklch(0.58_0.15_285)] text-white',   // soft violet
];

export function ArgumentAccordion({ argument, index }: ArgumentAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const accentHeader = ARG_ACCENT_HEADER[index % ARG_ACCENT_HEADER.length];
  const accentNumber = ARG_ACCENT_NUMBER[index % ARG_ACCENT_NUMBER.length];

  return (
    <Card className="overflow-hidden border-border transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <CardHeader className={cn('transition-opacity py-4 hover:opacity-90', accentHeader)}>
          <div className="flex items-start gap-4">
            <span className={cn('flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5', accentNumber)}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-snug">{argument.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed font-normal">
                {argument.summary}
              </p>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform mt-1',
                expanded && 'rotate-180'
              )}
            />
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-6 space-y-6 border-t border-border bg-muted/10">
          {/* Outline Points */}
          {argument.outlinePoints.length > 0 && (
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Key Points
              </h4>
              <ul className="space-y-2">
                {argument.outlinePoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-foreground leading-relaxed">
                    <span className="text-primary font-bold flex-shrink-0 mt-0.5">—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence */}
          {argument.evidence.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Supporting Evidence
              </h4>
              <div className="space-y-3">
                {argument.evidence.map((item, idx) => (
                  <EvidenceBlock key={idx} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Application */}
          {argument.application && (
            <div className="bg-primary/8 border border-primary/20 rounded-lg p-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Application
              </h4>
              <p className="text-sm text-foreground leading-relaxed">{argument.application}</p>
            </div>
          )}

          {/* Counterarguments */}
          {argument.counterarguments && argument.counterarguments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Common Counterarguments to Prepare For
              </h4>
              <ul className="space-y-2">
                {argument.counterarguments.map((counter, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-foreground leading-relaxed">
                    <span className="text-muted-foreground flex-shrink-0 font-mono mt-0.5">?</span>
                    <span>{counter}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
