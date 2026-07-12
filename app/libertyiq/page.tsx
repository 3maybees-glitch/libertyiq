import { topics } from '@/lib/types';
import { LibertyIQClient } from './LibertyIQClient';

export const metadata = {
  title: 'LibertyIQ Dashboard | Test Your Knowledge',
  description: 'Track your quiz progress and advance through the ranks on every conservative topic.',
};

export default function LibertyIQPage() {
  return <LibertyIQClient topics={topics} />;
}
