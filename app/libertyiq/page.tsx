import { topics } from '@/lib/types';
import { LibertyIQClient } from './LibertyIQClient';
import { ProFeature } from '@/components/pro-feature';

export const metadata = {
  title: 'LibertyIQ Dashboard | Test Your Knowledge',
  description: 'Track your quiz progress and advance through the ranks on every conservative topic.',
};

export default function LibertyIQPage() {
  return (
    <ProFeature
      title="Quizzes are a Pro feature"
      description="Unlock LibertyIQ Pro to take topic quizzes and climb the ranks from Intern Analyst to Chief Strategist."
    >
      <LibertyIQClient topics={topics} />
    </ProFeature>
  );
}
