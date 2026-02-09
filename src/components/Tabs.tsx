"use client";

type Tab = {
  label: string;
  value: string;
};

export default function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface2)] p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            value === tab.value
              ? "bg-[var(--accent2)] text-white"
              : "text-[var(--muted)] hover:text-[var(--text)]"
          }`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
