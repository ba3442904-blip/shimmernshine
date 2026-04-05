"use client";

import { useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import LeadForm from "@/components/LeadForm";

type ServiceOption = {
  id: string;
  name: string;
};

export default function BookingFormWithAvailability({
  services,
  defaultVehicleType = "",
  defaultNotes = "",
  showAvailability,
}: {
  services: ServiceOption[];
  defaultVehicleType?: string;
  defaultNotes?: string;
  showAvailability: boolean;
}) {
  const [preferredDate, setPreferredDate] = useState("");

  const handleSlotSelect = (date: string, time: string) => {
    setPreferredDate(`${date} at ${time}`);
  };

  return (
    <div className="grid gap-8">
      {showAvailability && (
        <div className="card-surface card-hover p-5">
          <AvailabilityPicker onSelect={handleSlotSelect} />
          {preferredDate && (
            <div className="mt-3 text-xs text-[var(--muted)]">
              Selected: <span className="font-semibold">{preferredDate}</span>
            </div>
          )}
        </div>
      )}
      <LeadForm
        type="booking"
        services={services}
        defaultVehicleType={defaultVehicleType}
        defaultNotes={defaultNotes}
        defaultPreferredDate={preferredDate}
      />
    </div>
  );
}
