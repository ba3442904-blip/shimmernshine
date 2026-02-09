import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import { getPublicReviews } from "@/lib/siteData";

export default async function ReviewsPage() {
  const reviews = await getPublicReviews();

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Reviews
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              4.9 stars from 120+ happy drivers.
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
          <div className="rounded-3xl bg-[var(--surface2)] p-8 text-center">
            <h2 className="text-2xl font-semibold">Leave a review</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              We&apos;d love to hear about your experience.
            </p>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
            >
              Leave a review
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
