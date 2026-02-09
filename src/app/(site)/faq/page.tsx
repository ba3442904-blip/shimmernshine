import Container from "@/components/Container";
import FAQAccordion from "@/components/FAQAccordion";
import { getPublicFaq } from "@/lib/siteData";

export default async function FAQPage() {
  const faqs = await getPublicFaq();

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              FAQ
            </div>
            <h1 className="mt-3 text-4xl font-semibold">Questions before you book?</h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Everything you need to know about mobile detailing with Shimmer N Shine.
            </p>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <FAQAccordion items={faqs} />
        </Container>
      </section>
    </div>
  );
}
