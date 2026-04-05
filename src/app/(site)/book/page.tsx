import Container from "@/components/Container";
import BookingFormWithAvailability from "@/components/BookingFormWithAvailability";
import Button from "@/components/Button";
import { getPublicAddOns, getPublicServices, getSettings } from "@/lib/siteData";
import { getDb } from "@/lib/prisma";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

const vehicleLabels: Record<string, string> = {
  sedan: "Sedan",
  suv: "Small SUV",
  truck: "Large SUV / Truck",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{
    vehicleType?: string;
    services?: string;
    addons?: string;
    total?: string;
  }>;
}) {
  const db = getDb();
  const [settings, allServices, allAddOns, params, calendarToken] = await Promise.all([
    getSettings(),
    getPublicServices(),
    getPublicAddOns(),
    searchParams,
    db.googleCalendarToken.findFirst().catch(() => null),
  ]);
  const hasCalendar = !!calendarToken;

  if (settings.booking.mode === "external" && settings.booking.bookingUrl) {
    return (
      <div className="flex flex-col gap-16 pb-24 pt-12">
        <section>
          <Container>
            <div className="card-surface card-hover p-10 text-center">
              <h1 className="text-3xl font-semibold">Book your detail online</h1>
              <p className="mt-3 text-[var(--muted)]">
                We use a secure booking partner to finalize appointments.
              </p>
              <Button href={settings.booking.bookingUrl} className="mt-6">
                Continue to booking
              </Button>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  // Parse estimate from query params
  const vehicleType = params?.vehicleType ?? "";
  const serviceIds = params?.services?.split(",").filter(Boolean) ?? [];
  const addOnIds = params?.addons?.split(",").filter(Boolean) ?? [];
  const totalCents = Number(params?.total) || 0;

  const hasEstimate = serviceIds.length > 0 || addOnIds.length > 0;

  const estimateServices = hasEstimate
    ? allServices
        .filter((s) => serviceIds.includes(s.id))
        .map((s) => ({
          name: s.name,
          priceCents:
            s.priceTiers.find((t) => t.vehicleSize === vehicleType)
              ?.priceCents ?? 0,
        }))
    : [];

  const estimateAddOns = hasEstimate
    ? allAddOns.filter((a) => addOnIds.includes(a.id))
    : [];

  // Build notes string for the lead form
  const estimateNotes = hasEstimate
    ? [
        `Estimate: ${vehicleLabels[vehicleType] ?? vehicleType}`,
        ...estimateServices.map(
          (s) => `- ${s.name}: ${s.priceCents ? formatPrice(s.priceCents) : "TBD"}`
        ),
        ...estimateAddOns.map(
          (a) => `- ${a.name}: ${formatPrice(a.priceCents)}`
        ),
        totalCents > 0 ? `Total: ${formatPrice(totalCents)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Booking
            </div>
            <h1 className="mt-3 text-4xl font-semibold">Request your appointment.</h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Tell us what you drive and when you need us there.
            </p>
          </div>
        </Container>
      </section>

      {hasEstimate && (
        <section>
          <Container>
            <div className="card-surface card-hover grid gap-3 p-5">
              <div className="text-sm font-semibold">Your Quote Summary</div>
              <div className="text-xs text-[var(--muted)]">
                {vehicleLabels[vehicleType] ?? vehicleType}
              </div>
              <div className="grid gap-1">
                {estimateServices.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span>{s.name}</span>
                    <span className="font-semibold">
                      {s.priceCents ? formatPrice(s.priceCents) : "TBD"}
                    </span>
                  </div>
                ))}
                {estimateAddOns.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span>{a.name}</span>
                    <span className="font-semibold">
                      {formatPrice(a.priceCents)}
                    </span>
                  </div>
                ))}
              </div>
              {totalCents > 0 && (
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-sm font-semibold">Estimated Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(totalCents)}
                  </span>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      <section>
        <Container>
          <BookingFormWithAvailability
            services={allServices}
            defaultVehicleType={vehicleType}
            defaultNotes={estimateNotes}
            showAvailability={hasCalendar}
          />
        </Container>
      </section>
    </div>
  );
}
