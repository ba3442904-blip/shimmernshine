"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";

type PriceTier = {
  vehicleSize: string;
  priceCents: number;
  isStartingAt: boolean;
};

type Service = {
  id: string;
  name: string;
  shortDescription: string;
  priceTiers: PriceTier[];
};

type AddOn = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

const vehicleOptions = [
  { label: "Sedan", value: "sedan" },
  { label: "Small SUV", value: "suv" },
  { label: "Large SUV / Truck", value: "truck" },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function QuoteEstimator({
  services,
  addOns,
}: {
  services: Service[];
  addOns: AddOn[];
}) {
  const [vehicleSize, setVehicleSize] = useState("sedan");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(
    new Set()
  );

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const servicePricing = useMemo(() => {
    return services.map((service) => {
      const tier = service.priceTiers.find((t) => t.vehicleSize === vehicleSize);
      return { ...service, priceCents: tier?.priceCents ?? 0 };
    });
  }, [services, vehicleSize]);

  const selectedServices = servicePricing.filter((s) =>
    selectedServiceIds.has(s.id)
  );
  const selectedAddOns = addOns.filter((a) => selectedAddOnIds.has(a.id));

  const totalCents =
    selectedServices.reduce((sum, s) => sum + s.priceCents, 0) +
    selectedAddOns.reduce((sum, a) => sum + a.priceCents, 0);

  const vehicleLabel =
    vehicleOptions.find((v) => v.value === vehicleSize)?.label ?? vehicleSize;

  const bookingUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("vehicleType", vehicleSize);
    if (selectedServiceIds.size > 0)
      params.set("services", Array.from(selectedServiceIds).join(","));
    if (selectedAddOnIds.size > 0)
      params.set("addons", Array.from(selectedAddOnIds).join(","));
    if (totalCents > 0) params.set("total", String(totalCents));
    return `/book?${params.toString()}`;
  }, [vehicleSize, selectedServiceIds, selectedAddOnIds, totalCents]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Left: Selection */}
      <div className="grid gap-8">
        {/* Vehicle size */}
        <div className="grid gap-3">
          <div className="text-sm font-semibold">Vehicle size</div>
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
        </div>

        {/* Services */}
        <div className="grid gap-3">
          <div className="text-sm font-semibold">Services</div>
          <div className="grid gap-2">
            {servicePricing.map((service) => (
              <label
                key={service.id}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                  selectedServiceIds.has(service.id)
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.has(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <div>
                    <div className="text-sm font-semibold">{service.name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {service.shortDescription}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold">
                  {service.priceCents
                    ? formatPrice(service.priceCents)
                    : "Call for quote"}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className="grid gap-3">
            <div className="text-sm font-semibold">Add-ons</div>
            <div className="grid gap-2">
              {addOns.map((addOn) => (
                <label
                  key={addOn.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                    selectedAddOnIds.has(addOn.id)
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddOnIds.has(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <div>
                      <div className="text-sm font-semibold">{addOn.name}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {addOn.description}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold">
                    {formatPrice(addOn.priceCents)}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Estimate summary (sticky) */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="card-surface card-hover grid gap-4 p-5">
          <div className="text-sm font-semibold">Your Estimate</div>

          {selectedServices.length === 0 && selectedAddOns.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">
              Select services and add-ons to build your quote.
            </p>
          ) : (
            <div className="grid gap-2">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {service.name}{" "}
                    <span className="text-[var(--muted)]">
                      ({vehicleLabel})
                    </span>
                  </span>
                  <span className="font-semibold">
                    {service.priceCents
                      ? formatPrice(service.priceCents)
                      : "TBD"}
                  </span>
                </div>
              ))}
              {selectedAddOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{addOn.name}</span>
                  <span className="font-semibold">
                    {formatPrice(addOn.priceCents)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Estimated Total</span>
                  <span className="text-lg font-semibold">
                    {totalCents > 0 ? formatPrice(totalCents) : "Call for quote"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button href={bookingUrl}>Request This Quote</Button>
        </div>
      </div>
    </div>
  );
}
