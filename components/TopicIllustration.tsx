import React from 'react';

interface Props {
  slug: string;
  title: string;
}

const TOPIC_IMAGES: Record<string, string> = {
  'pro-life':              '/images/topics/pro-life.jpg',
  'immigration':           '/images/topics/immigration.jpg',
  'second-amendment':      '/images/topics/second-amendment.jpg',
  'marriage':              '/images/topics/marriage.jpg',
  'two-sexes':             '/images/topics/two-sexes.jpg',
  'pro-israel':            '/images/topics/pro-israel.jpg',
  'national-security':     '/images/topics/national-security.jpg',
  'anti-climate-alarmism': '/images/topics/anti-climate-alarmism.jpg',
  'limited-government':    '/images/topics/limited-government.jpg',
  'anti-crt':              '/images/topics/anti-crt.jpg',
  'crime-and-justice':     '/images/topics/crime-and-justice.jpg',
  'role-of-the-military':  '/images/topics/role-of-the-military.jpg',
  'universal-healthcare':  '/images/topics/universal-healthcare.jpg',
  'ai-governance':         '/images/topics/ai-governance.jpg',
};

export function TopicIllustration({ slug, title }: Props) {
  const src = TOPIC_IMAGES[slug];
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}
