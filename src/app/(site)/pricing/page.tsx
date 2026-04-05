import Container from "@/components/Container";
import QuoteEstimator from "@/components/QuoteEstimator";
import { getPublicAddOns, getPublicServices } from "@/lib/siteData";

export default async function PricingPage() {
  const [services, addOns] = await Promise.all([
    getPublicServices(),
    getPublicAddOns(),
  ]);

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Pricing
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              Build your custom quote.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Select your vehicle size, pick services and add-ons, and see your
              estimated total instantly.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <QuoteEstimator services={services} addOns={addOns} />
        </Container>
      </section>
    </div>
  );
}
