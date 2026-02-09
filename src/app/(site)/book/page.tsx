import Container from "@/components/Container";
import LeadForm from "@/components/LeadForm";
import Button from "@/components/Button";
import { getPublicServices, getSettings } from "@/lib/siteData";

export default async function BookPage() {
  const [settings, services] = await Promise.all([getSettings(), getPublicServices()]);

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
      <section>
        <Container>
          <LeadForm
            type="booking"
            services={services}
            businessEmail={settings.businessInfo.email}
          />
        </Container>
      </section>
    </div>
  );
}
