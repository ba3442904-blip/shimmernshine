import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import FAQAccordion from "@/components/FAQAccordion";
import ElfsightGoogleReviews from "@/components/ElfsightGoogleReviews";
import InstantQuoteForm from "@/components/InstantQuoteForm";
import ServiceCard from "@/components/ServiceCard";
import { getPublicFaq, getPublicServices, getSettings } from "@/lib/siteData";

export default async function HomePage() {
  const [settings, services, faqs] = await Promise.all([
    getSettings(),
    getPublicServices(),
    getPublicFaq(),
  ]);

  return (
    <div className="flex flex-col gap-20 pb-24 pt-12">
      <section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Mobile auto detailing
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Mobile Detailing That Makes Your Car Feel New
              </h1>
              <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
                Premium detailing at your home or office. We bring the tools, the polish,
                and the results that make your vehicle shine.
              </p>
              <div className="mt-4 shine-bar" />
              <div className="mt-6 flex flex-wrap gap-4">
                <Button href="/book">Book Now</Button>
                <Button href="/contact" variant="secondary">
                  Get a Quote
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[var(--muted)]">
                {settings.trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-2"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="bg-gradient-to-br from-[var(--surface)] via-[var(--surface2)] to-[#0b1020]">
                <div className="text-sm font-semibold">Detailing result preview</div>
                <div className="mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--surface2)] text-xs font-semibold text-[var(--muted)] shadow-sm flex items-center justify-center">
                  {settings.hero?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.hero.imageUrl}
                      alt="Hero detailing"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "Hero image placeholder"
                  )}
                </div>
              </Card>
              <InstantQuoteForm services={services} />
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Instagram
              </div>
              <h2 className="mt-3 text-3xl font-semibold">Latest from the shop.</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Fresh details, before-and-after shots, and what we&apos;re working on now.
              </p>
            </div>
            <Button
              href={settings.socials.instagram || "https://www.instagram.com/"}
              variant="secondary"
            >
              Follow on Instagram
            </Button>
          </div>
          <iframe
            src={settings.integrations.instagramEmbedUrl}
            className="snapwidget-widget snapwidget-embed"
            allowTransparency
            frameBorder={0}
            scrolling="no"
            style={{ border: "none", overflow: "hidden", width: "100%", height: "510px" }}
            title="Posts from Instagram"
          />
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Services
              </div>
              <h2 className="mt-3 text-3xl font-semibold">Packages built for every vehicle.</h2>
            </div>
            <Link href="/services" className="text-sm font-semibold text-[var(--primary)]">
              View all services →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Google Reviews
            </div>
            <h2 className="mt-3 text-3xl font-semibold">See what customers are saying.</h2>
          </div>
          {settings.integrations.googleReviewsElfsightAppId ? (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface2)] p-4">
              <ElfsightGoogleReviews appId={settings.integrations.googleReviewsElfsightAppId} />
            </div>
          ) : settings.integrations.googleReviewsEmbedUrl ? (
            <iframe
              src={settings.integrations.googleReviewsEmbedUrl}
              className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface2)]"
              frameBorder={0}
              scrolling="no"
              style={{ minHeight: "560px" }}
              title="Google reviews"
            />
          ) : (
            <div className="rounded-3xl bg-[var(--surface2)] p-8 text-center">
              <p className="text-sm text-[var(--muted)]">Want to read more verified feedback?</p>
              <a
                href="https://www.google.com/maps/place/Shimmer+N+Shine+Mobile+Auto+Detailing/@39.0626914,-77.1138284,49087m/data=!3m1!1e3!4m18!1m9!3m8!1s0x6b7616c148430305:0x4cfe70c474dbb243!2sShimmer+N+Shine+Mobile+Auto+Detailing!8m2!3d39.0626914!4d-77.1138284!9m1!1b1!16s%2Fg%2F11xcg00m2k!3m7!1s0x6b7616c148430305:0x4cfe70c474dbb243!8m2!3d39.0626914!4d-77.1138284!9m1!1b1!16s%2Fg%2F11xcg00m2k?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
              >
                Read Google Reviews
              </a>
            </div>
          )}
        </Container>
      </section>

      <section>
        <Container>
          <div className="card-surface card-hover p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Service area
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              We come to you within {settings.serviceArea.radiusMiles} miles.
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {settings.serviceArea.travelFeePolicy}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {settings.serviceArea.towns.map((town) => (
                <span key={town} className="rounded-full bg-[var(--surface2)] px-3 py-2">
                  {town}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              FAQs
            </div>
            <h2 className="mt-3 text-3xl font-semibold">Good to know before you book.</h2>
          </div>
          <FAQAccordion items={faqs} />
        </Container>
      </section>

      <section>
        <Container>
          <div className="rounded-3xl bg-[var(--primary)] p-10 text-white shadow-[0_30px_60px_rgba(10,87,255,0.25)]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-3xl font-semibold">Ready for a spotless car?</h2>
                <p className="mt-3 text-white/80">
                  Book today and we&apos;ll bring the shine to your driveway.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <Button href="/book" className="bg-[var(--surface)] text-[var(--accent2)]">
                  Book Now
                </Button>
                <Button href={`tel:${settings.businessInfo.phone}`} variant="secondary">
                  Call {settings.businessInfo.phone}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
