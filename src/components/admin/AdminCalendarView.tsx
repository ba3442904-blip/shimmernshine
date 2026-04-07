"use client";

import { useCallback, useEffect, useState } from "react";

type CalEvent = {
  id: string | null | undefined;
  summary: string;
  start: string | null;
  end: string | null;
  allDay: boolean;
  colorId: string | null;
  htmlLink: string | null;
};

// Google Calendar color palette (colorId → background)
const GC_COLORS: Record<string, string> = {
  "1": "#a4bdfc",
  "2": "#7ae7bf",
  "3": "#dbadff",
  "4": "#ff887c",
  "5": "#fbd75b",
  "6": "#ffb878",
  "7": "#46d6db",
  "8": "#e1e1e1",
  "9": "#5484ed",
  "10": "#51b749",
  "11": "#dc2127",
};
const DEFAULT_COLOR = "#4285f4";

function eventColor(colorId: string | null) {
  return colorId ? (GC_COLORS[colorId] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${ampm}` : `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AdminCalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar/events?year=${y}&month=${m}`);
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(year, month);
  }, [year, month, fetchEvents]);

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  // Build calendar grid (6 rows × 7 cols)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), current: false });
  }

  function eventsForDate(date: Date) {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return events.filter((e) => {
      if (!e.start) return false;
      const start = e.allDay ? e.start : e.start.slice(0, 10);
      return start === key;
    });
  }

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3 sm:px-6">
        <button
          onClick={goToday}
          className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-semibold hover:bg-[var(--surface2)] transition-colors"
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="rounded-full p-1.5 hover:bg-[var(--surface2)] transition-colors"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="rounded-full p-1.5 hover:bg-[var(--surface2)] transition-colors"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <span className="text-sm font-semibold">
          {MONTHS[month]} {year}
        </span>
        {loading && (
          <span className="ml-auto text-xs text-[var(--muted)]">Loading…</span>
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold text-[var(--muted)]">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7" style={{ minHeight: "540px" }}>
        {cells.map(({ date, current }, i) => {
          const dayEvents = eventsForDate(date);
          const today_ = isToday(date);
          return (
            <div
              key={i}
              className={`min-h-[90px] border-b border-r border-[var(--border)] p-1 ${
                !current ? "bg-[var(--surface2)]/40" : ""
              } ${i % 7 === 0 ? "" : ""}`}
            >
              <div className="mb-1 flex justify-start px-0.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    today_
                      ? "bg-[var(--primary)] text-white"
                      : current
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>
              <div className="flex flex-col gap-px">
                {dayEvents.slice(0, 3).map((ev) => (
                  <a
                    key={ev.id ?? ev.summary}
                    href={ev.htmlLink ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate rounded px-1 py-px text-[10px] font-medium leading-tight text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: eventColor(ev.colorId) }}
                    title={ev.summary}
                  >
                    {!ev.allDay && ev.start && (
                      <span className="opacity-80">{formatTime(ev.start)} </span>
                    )}
                    {ev.summary}
                  </a>
                ))}
                {dayEvents.length > 3 && (
                  <span className="px-1 text-[10px] text-[var(--muted)]">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-5 py-2.5 sm:px-6">
        <span className="text-[11px] text-[var(--muted)]">
          Events shown in time zone: (GMT-04:00) Eastern Time – New York
        </span>
      </div>
    </div>
  );
}
