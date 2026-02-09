import Container from "@/components/Container";
import LeadForm from "@/components/LeadForm";
import { getPublicServices, getSettings } from "@/lib/siteData";

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getPublicServices()]);

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Contact
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              Request a quote or ask a question.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              We&apos;ll reply quickly to confirm your service and availability.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="card-surface card-hover space-y-6 p-6">
              <div>
                <div className="text-sm font-semibold">Contact info</div>
                <div className="mt-3 text-sm text-[var(--muted)]">
                  <div>{settings.businessInfo.phone}</div>
                  <div>{settings.businessInfo.email}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Hours</div>
                <div className="mt-3 text-sm text-[var(--muted)]">
                  {Object.entries(settings.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Service area</div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {settings.serviceArea.center} • {settings.serviceArea.radiusMiles} mile
                  radius
                </p>
              </div>
            </div>
            <LeadForm
              type="quote"
              services={services}
              businessEmail={settings.businessInfo.email}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
