import Link from "next/link";
import Card from "@/components/Card";

type Service = {
  id: string;
  name: string;
  shortDescription: string;
  priceTiers: { priceCents: number; isStartingAt: boolean }[];
};

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(0)}`;
}

export default function ServiceCard({ service }: { service: Service }) {
  const starting = service.priceTiers.sort((a, b) => a.priceCents - b.priceCents)[0];

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="text-lg font-semibold">{service.name}</div>
      <p className="text-sm text-[var(--muted)]">{service.shortDescription}</p>
      <div className="text-sm font-semibold text-[var(--accent)]">
        Starting at {starting ? formatPrice(starting.priceCents) : "Call for quote"}
      </div>
      <Link href="/services" className="mt-auto text-sm font-semibold text-[var(--accent)]">
        View details →
      </Link>
    </Card>
  );
}
