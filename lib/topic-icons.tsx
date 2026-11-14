import {
  Baby,
  Ban,
  Brain,
  CloudOff,
  Cross,
  Flag,
  Gavel,
  Heart,
  Landmark,
  Scale,
  Shield,
  ShieldCheck,
  Swords,
  Users,
  type LucideIcon,
} from 'lucide-react'

/** Small visual accent per library topic (decorative, not semantic taxonomy). */
export const TOPIC_ICONS: Record<string, LucideIcon> = {
  'pro-life': Baby,
  'illegal-immigration': Users,
  'second-amendment': Shield,
  marriage: Heart,
  'two-sexes': Scale,
  'pro-israel': Flag,
  'national-security': ShieldCheck,
  'anti-climate-alarmism': CloudOff,
  'limited-government': Landmark,
  'anti-crt': Ban,
  'crime-and-justice': Gavel,
  'role-of-the-military': Swords,
  'universal-healthcare': Cross,
  'ai-governance': Brain,
}

export function TopicIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = TOPIC_ICONS[slug] ?? Landmark
  return <Icon className={className} aria-hidden />
}