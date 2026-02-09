import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import FAQAccordion from "@/components/FAQAccordion";
import InstantQuoteForm from "@/components/InstantQuoteForm";
import PricingCard from "@/components/PricingCard";
import ReviewCard from "@/components/ReviewCard";
import ServiceCard from "@/components/ServiceCard";
import Script from "next/script";
import { getPublicFaq, getPublicGallery, getPublicReviews, getPublicServices, getSettings } from "@/lib/siteData";

export default async function HomePage() {
  const [settings, services, gallery, reviews, faqs] = await Promise.all([
    getSettings(),
    getPublicServices(),
    getPublicGallery(),
    getPublicReviews(true),
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
              href="https://www.instagram.com/shimmer.n.shine_autodetailing/"
              variant="secondary"
            >
              Follow on Instagram
            </Button>
          </div>
          <iframe
            src="https://snapwidget.com/embed/1117801"
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
          <div className="card-surface card-hover grid gap-10 p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                How it works
              </div>
              <h2 className="mt-3 text-3xl font-semibold">Booking is simple.</h2>
              <ol className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
                {[
                  "Pick a package",
                  "Choose a time",
                  "We come to you",
                  "Drive off happy",
                ].map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(0, 4).map((image) => (
                <div
                  key={image.id}
                  className="aspect-[4/3] rounded-2xl bg-[var(--surface2)] text-xs font-semibold text-[var(--muted)] shadow-sm flex items-center justify-center"
                >
                  {image.alt}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8 flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Pricing
            </div>
            <h2 className="text-3xl font-semibold">Good, better, best.</h2>
            <p className="text-sm text-[var(--muted)]">
              Transparent starting prices with add-ons available.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              title="Refresh"
              description="Quick clean for daily drivers."
              price="$149+"
              features={["Exterior wash", "Interior wipe-down", "Light vacuum"]}
            />
            <PricingCard
              title="Restore"
              description="Deep clean inside and out."
              price="$279+"
              features={[
                "Interior shampoo",
                "Clay bar treatment",
                "Protective sealant",
              ]}
              highlight
            />
            <PricingCard
              title="Showroom"
              description="Complete detailing experience."
              price="$369+"
              features={[
                "Full interior detail",
                "Gloss enhancement",
                "Wheel + tire dressing",
              ]}
            />
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Reviews
              </div>
              <h2 className="mt-3 text-3xl font-semibold">Trusted by busy drivers.</h2>
            </div>
            <Link href="/reviews" className="text-sm font-semibold text-[var(--primary)]">
              Read all reviews →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="card-surface card-hover grid gap-8 p-8 lg:grid-cols-[1fr_1fr]">
            <div>
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
            <div className="rounded-3xl bg-[var(--surface2)] p-6 text-xs font-semibold text-[var(--muted)] flex items-center justify-center">
              Map placeholder
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              FAQ
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
