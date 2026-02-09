import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PricingTable from "@/components/PricingTable";
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
              Transparent pricing with no surprises.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Select your vehicle size to view starting prices. Final quotes may adjust
              based on condition.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <PricingTable services={services} />
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-[var(--surface2)]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Maintenance plans
                </div>
                <h2 className="mt-3 text-3xl font-semibold">
                  Keep your vehicle spotless year-round.
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Choose monthly or biweekly visits for consistent protection and
                  preferred scheduling.
                </p>
                <Button href="/contact" className="mt-4">
                  Ask about plans
                </Button>
              </div>
              <div className="grid gap-3 text-sm text-[var(--muted)]">
                {addOns.slice(0, 4).map((addOn) => (
                  <div key={addOn.id} className="rounded-2xl bg-[var(--surface)] p-4">
                    {addOn.name}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
