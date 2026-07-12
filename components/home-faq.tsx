import { SITE_FAQS } from '@/lib/site';

export function HomeFaq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mt-16 pt-8 border-t border-border/30"
    >
      <h2 id="faq-heading" className="text-xl font-bold text-foreground mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <dl className="mx-auto max-w-3xl space-y-6">
        {SITE_FAQS.map((faq) => (
          <div key={faq.question} className="rounded-xl border border-border bg-card p-5">
            <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
            <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
