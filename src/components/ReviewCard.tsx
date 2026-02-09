import Card from "@/components/Card";

type Review = {
  name: string;
  stars: number;
  text: string;
  date: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="text-sm font-semibold text-[var(--accent)]">
        {"★".repeat(review.stars)}
      </div>
      <p className="text-sm text-[var(--muted)]">{review.text}</p>
      <div className="mt-auto text-sm font-semibold">
        {review.name} · <span className="text-[var(--muted)]">{review.date}</span>
      </div>
    </Card>
  );
}
