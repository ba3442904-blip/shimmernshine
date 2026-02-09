import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { getPublicAddOns, getPublicServices } from "@/lib/siteData";

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(0)}`;
}

export default async function ServicesPage() {
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
              Services
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              Detailing packages tailored to how you drive.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Every package is performed on-site with premium products and meticulous
              attention to detail.
            </p>
          </div>
        </Container>
      </section>

      {services.map((service) => {
        const starting = service.priceTiers.sort(
          (a, b) => a.priceCents - b.priceCents
        )[0];

        return (
          <section key={service.id}>
            <Container>
              <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold">{service.name}</h2>
                  <p className="text-[var(--muted)]">{service.longDescription}</p>
                  <div className="grid gap-2 text-sm text-[var(--muted)]">
                    <div>
                      <span className="font-semibold text-[var(--text)]">Time:</span>{" "}
                      {service.durationMins} minutes
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--text)]">Starting at:</span>{" "}
                      {starting ? formatPrice(starting.priceCents) : "Call for quote"}
                    </div>
                  </div>
                  <Button href="/book">Book this service</Button>
                </div>
                <Card className="bg-[var(--surface2)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                    What&apos;s included
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                    <li>• Hand wash and safe drying</li>
                    <li>• Interior vacuum + wipe-down</li>
                    <li>• Wheel and tire clean</li>
                    <li>• Trim protection</li>
                  </ul>
                </Card>
              </div>
            </Container>
          </section>
        );
      })}

      <section>
        <Container>
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Add-ons
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              Boost your detail with specialty add-ons.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addOn) => (
              <Card key={addOn.id} className="flex flex-col gap-3">
                <div className="text-lg font-semibold">{addOn.name}</div>
                <p className="text-sm text-[var(--muted)]">{addOn.description}</p>
                <div className="text-sm font-semibold text-[var(--accent)]">
                  + {formatPrice(addOn.priceCents)}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
