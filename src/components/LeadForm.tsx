"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { CheckIcon } from "@/components/Icons";

type ServiceOption = {
  id: string;
  name: string;
};

export default function LeadForm({
  type,
  services,
  defaultVehicleType = "",
  defaultNotes = "",
  defaultPreferredDate = "",
}: {
  type: "quote" | "booking";
  services: ServiceOption[];
  defaultVehicleType?: string;
  defaultNotes?: string;
  defaultPreferredDate?: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  async function handleSubmit(formData: FormData) {
    if (submitting) return;
    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    const payload = {
      type,
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      vehicleType: String(formData.get("vehicleType") || ""),
      serviceId: String(formData.get("serviceId") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      address: String(formData.get("address") || ""),
      notes: String(formData.get("notes") || ""),
    };

    setSubmittedName(payload.name);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to submit your request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="card-surface grid gap-4 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
          <CheckIcon className="h-7 w-7 text-green-500" />
        </div>
        <div className="grid gap-1">
          <p className="text-lg font-semibold">
            {submittedName ? `Got it, ${submittedName}!` : "We received your request!"}
          </p>
          <p className="text-sm text-[var(--muted)]">
            We&apos;ll follow up shortly to confirm your{" "}
            {type === "booking" ? "booking" : "quote"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card-surface card-hover grid gap-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <input
            name="name"
            required
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Phone
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Vehicle type
          <input
            name="vehicleType"
            placeholder="Sedan, SUV, Truck"
            defaultValue={defaultVehicleType}
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Service
        <select
          name="serviceId"
          className="input-surface rounded-xl px-4 py-3 text-sm"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Preferred date
          <input
            name="preferredDate"
            placeholder="MM/DD"
            inputMode="numeric"
            defaultValue={defaultPreferredDate}
            key={defaultPreferredDate}
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Address
          <input
            name="address"
            className="input-surface rounded-xl px-4 py-3 text-sm"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Notes
        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultNotes}
          className="input-surface rounded-xl px-4 py-3 text-sm"
        />
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending\u2026" : "Send request"}
      </Button>
      {status === "error" ? (
        <p className="text-sm text-red-600">{message}</p>
      ) : null}
    </form>
  );
}
