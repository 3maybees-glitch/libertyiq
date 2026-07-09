import Image from 'next/image';

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
};

export function TopicIllustration({ slug, title }: Props) {
  const src = TOPIC_IMAGES[slug];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
    />
  );
}
