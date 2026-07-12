type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function toGraphPayload(data: Record<string, unknown> | Record<string, unknown>[]) {
  if (!Array.isArray(data)) return data;

  return {
    '@context': 'https://schema.org',
    '@graph': data.map((item) => {
      const { '@context': _context, ...rest } = item;
      return rest;
    }),
  };
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(toGraphPayload(data)) }}
    />
  );
}
