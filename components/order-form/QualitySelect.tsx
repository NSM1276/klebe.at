"use client";

const OPTIONS = [
  { value: "basic", years: 3 },
  { value: "standard", years: 5 },
  { value: "premium", years: 10 },
] as const;

export type Quality = (typeof OPTIONS)[number]["value"];

export function QualitySelect({
  value,
  onChange,
  label,
}: {
  value: Quality;
  onChange: (value: Quality) => void;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm text-white/70 mb-2">{label}</legend>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md border text-sm ${
              value === option.value
                ? "bg-accent border-accent text-black"
                : "border-white/20 text-white"
            }`}
          >
            {option.value} · {option.years}J
          </button>
        ))}
      </div>
    </fieldset>
  );
}
