"use client";

const OPTIONS = ["25x25", "30x30", "35x35"] as const;

export type Size = (typeof OPTIONS)[number];

export function SizeSelect({
  value,
  onChange,
  label,
}: {
  value: Size;
  onChange: (value: Size) => void;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm text-white/70 mb-2">{label}</legend>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-md border text-sm ${
              value === option
                ? "bg-accent border-accent text-black"
                : "border-white/20 text-white"
            }`}
          >
            {option} cm
          </button>
        ))}
      </div>
    </fieldset>
  );
}
