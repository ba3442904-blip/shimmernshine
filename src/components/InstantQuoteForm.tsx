"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

type ServiceOption = {
  id: string;
  name: string;
};

export default function InstantQuoteForm({
  services,
}: {
  services: ServiceOption[];
}) {
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const vehicleType = String(formData.get("vehicleType") || "");
    const serviceId = String(formData.get("serviceId") || "");
    const params = new URLSearchParams();
    if (vehicleType) params.set("vehicleType", vehicleType);
    if (serviceId) params.set("serviceId", serviceId);
    router.push(`/contact?${params.toString()}`);
  }

  return (
    <form
      className="card-surface card-hover grid gap-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <div className="text-sm font-semibold text-[var(--muted)]">
        Instant Quote
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Vehicle type
        <select
          name="vehicleType"
          className="input-surface rounded-xl px-4 py-3 text-sm"
        >
          <option value="">Select</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Truck">Truck</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Service
        <select
          name="serviceId"
          className="input-surface rounded-xl px-4 py-3 text-sm"
        >
          <option value="">Select service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="secondary">
        Get a quick quote
      </Button>
    </form>
  );
}
