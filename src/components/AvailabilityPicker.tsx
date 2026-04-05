"use client";

import { useCallback, useState } from "react";

type Slot = { start: string; end: string };

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getNext14Days() {
  const days: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function AvailabilityPicker({
  durationMins = 120,
  onSelect,
}: {
  durationMins?: number;
  onSelect: (date: string, time: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const days = getNext14Days();

  const fetchSlots = useCallback(
    async (date: string) => {
      setSelectedDate(date);
      setSelectedSlot("");
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/calendar/availability?date=${date}&durationMins=${durationMins}`
        );
        if (res.ok) {
          const data = await res.json();
          setSlots(data.slots ?? []);
        } else {
          setSlots([]);
        }
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [durationMins]
  );

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot.start);
    const d = new Date(slot.start);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    onSelect(dateStr, timeStr);
  };

  return (
    <div className="grid gap-4">
      <div className="text-sm font-semibold">Pick a date</div>
      <div className="flex flex-wrap gap-2">
        {days.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => fetchSlots(date)}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              selectedDate === date
                ? "bg-[var(--accent2)] text-white"
                : "bg-[var(--surface2)] text-[var(--muted)]"
            }`}
          >
            {formatDateLabel(date)}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="grid gap-3">
          <div className="text-sm font-semibold">Available times</div>
          {loading ? (
            <p className="text-xs text-[var(--muted)]">Loading availability...</p>
          ) : slots.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">
              No available slots for this date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    selectedSlot === slot.start
                      ? "bg-[var(--accent2)] text-white"
                      : "bg-[var(--surface2)] text-[var(--muted)]"
                  }`}
                >
                  {formatTime(slot.start)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
