"use client";

import { useState } from "react";
import Button from "@/components/Button";

type ServiceOption = {
  id: string;
  name: string;
};

export default function LeadForm({
  type,
  services,
  businessEmail,
}: {
  type: "quote" | "booking";
  services: ServiceOption[];
  businessEmail: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
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
      setMessage("Thanks! We received your request and will follow up shortly.");

      if (businessEmail) {
        const subject =
          type === "booking" ? "New booking request" : "New quote request";
        const mailto = `mailto:${businessEmail}?subject=${encodeURIComponent(
          subject
        )}`;
        window.open(mailto, "_blank");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to submit your request."
      );
    }
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
          className="input-surface rounded-xl px-4 py-3 text-sm"
        />
      </label>
      <Button type="submit">Send request</Button>
      {status !== "idle" ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
