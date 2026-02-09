import Card from "@/components/Card";
import Button from "@/components/Button";

type PricingCardProps = {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

export default function PricingCard({
  title,
  description,
  price,
  features,
  highlight,
}: PricingCardProps) {
  return (
    <Card
      className={`flex h-full flex-col gap-4 ${
        highlight ? "border-[var(--accent)] bg-[var(--surface2)]" : ""
      }`}
    >
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="text-sm text-[var(--muted)]">{description}</p>
      </div>
      <div className="text-3xl font-semibold">{price}</div>
      <ul className="grid gap-2 text-sm text-[var(--muted)]">
        {features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <Button href="/book" variant={highlight ? "primary" : "secondary"} className="mt-auto">
        Book this package
      </Button>
    </Card>
  );
}
