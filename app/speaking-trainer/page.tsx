import type { Metadata } from 'next';
import LibertyIQPublicSpeakingTrainer from '@/components/libertyiq-public-speaking-trainer';
import { JsonLd } from '@/components/json-ld';
import { createPageMetadata, learningResourceJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Public Speaking Trainer — Practice & Analyze Your Speech',
  description:
    'Practice public speaking with LibertyIQ.org speaking trainer. Live speech transcription, filler-word analysis, clarity scoring, and coaching tips. Free browser-based tool.',
  path: '/speaking-trainer',
  keywords: ['public speaking trainer', 'filler words', 'speech practice', 'debate preparation', 'LibertyIQ'],
});

export default function SpeakingTrainerPage() {
  return (
    <>
      <JsonLd
        data={learningResourceJsonLd({
          name: 'LibertyIQ Public Speaking Trainer',
          description:
            'Browser-based speech practice tool with filler-word analysis, clarity scoring, and coaching feedback.',
          path: '/speaking-trainer',
        })}
      />
      <LibertyIQPublicSpeakingTrainer />
    </>
  );
}
