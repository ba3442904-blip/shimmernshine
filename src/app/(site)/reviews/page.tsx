import Container from "@/components/Container";
import ElfsightGoogleReviews from "@/components/ElfsightGoogleReviews";
import ReviewCard from "@/components/ReviewCard";
import { getPublicReviews, getSettings } from "@/lib/siteData";

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([getPublicReviews(), getSettings()]);

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Reviews
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              4.9 stars from 20+ happy drivers.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Consistent service, trusted results, and a spotless finish.
            </p>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </Container>
      </section>
      <section>
        <Container>
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
              <h2 className="text-2xl font-semibold">Leave a review</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                We&apos;d love to hear about your experience.
              </p>
              <a
                href="https://www.google.com/maps/place/Shimmer+N+Shine+Mobile+Auto+Detailing/@39.0626914,-77.1138284,49087m/data=!3m1!1e3!4m18!1m9!3m8!1s0x6b7616c148430305:0x4cfe70c474dbb243!2sShimmer+N+Shine+Mobile+Auto+Detailing!8m2!3d39.0626914!4d-77.1138284!9m1!1b1!16s%2Fg%2F11xcg00m2k!3m7!1s0x6b7616c148430305:0x4cfe70c474dbb243!8m2!3d39.0626914!4d-77.1138284!9m1!1b1!16s%2Fg%2F11xcg00m2k?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
              >
                Leave a review
              </a>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
