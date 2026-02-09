"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";

type Service = {
  id: string;
  name: string;
  shortDescription: string;
  priceTiers: { vehicleSize: string; priceCents: number; isStartingAt: boolean }[];
};

const vehicleOptions = [
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Truck", value: "truck" },
];

function formatPrice(priceCents?: number) {
  if (!priceCents) return "Call for quote";
  return `$${(priceCents / 100).toFixed(0)}`;
}

export default function PricingTable({ services }: { services: Service[] }) {
  const [vehicleSize, setVehicleSize] = useState("sedan");

  const pricing = useMemo(() => {
    return services.map((service) => {
      const tier = service.priceTiers.find((t) => t.vehicleSize === vehicleSize);
      return { ...service, price: tier?.priceCents };
    });
  }, [services, vehicleSize]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2">
        {vehicleOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              vehicleSize === option.value
                ? "bg-[var(--accent2)] text-white"
                : "bg-[var(--surface2)] text-[var(--muted)]"
            }`}
            onClick={() => setVehicleSize(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pricing.map((service, index) => (
          <Card
            key={service.id}
            className={`flex h-full flex-col gap-4 ${
              index === 1 ? "border-[var(--accent)] bg-[var(--surface2)]" : ""
            }`}
          >
            <div className="text-lg font-semibold">{service.name}</div>
            <p className="text-sm text-[var(--muted)]">{service.shortDescription}</p>
            <div className="text-3xl font-semibold">{formatPrice(service.price)}</div>
            <p className="text-xs text-[var(--muted)]">Starting price for {vehicleSize}</p>
            <Button href="/book" variant={index === 1 ? "primary" : "secondary"}>
              Book now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
