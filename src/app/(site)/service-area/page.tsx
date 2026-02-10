import Container from "@/components/Container";
import { getSettings } from "@/lib/siteData";

export default async function ServiceAreaPage() {
  const settings = await getSettings();
  const { serviceArea } = settings;

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Service area
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              Serving {serviceArea.center} and surrounding neighborhoods.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              We&apos;ll travel up to {serviceArea.radiusMiles} miles to bring mobile
              detailing directly to you.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="card-surface card-hover grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-sm font-semibold">Towns we serve</div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                {serviceArea.towns.map((town) => (
                  <span key={town} className="rounded-full bg-[var(--surface2)] px-3 py-2">
                    {town}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">
                {serviceArea.travelFeePolicy}
              </p>
            </div>
            <div className="rounded-3xl bg-[var(--surface2)] p-4 text-xs font-semibold text-[var(--muted)] flex items-center justify-center">
              {serviceArea.mapEmbedUrl ? (
                <div className="relative h-80 w-full overflow-hidden rounded-2xl lg:h-96">
                  <iframe
                    title="Service area map"
                    src={serviceArea.mapEmbedUrl}
                    scrolling="no"
                    className="absolute left-1/2 top-1/2 h-[115%] w-[115%] border-0"
                    style={{ transform: "translate(-50%, -50%) scale(0.9)" }}
                  />
                </div>
              ) : (
                "Map placeholder"
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
