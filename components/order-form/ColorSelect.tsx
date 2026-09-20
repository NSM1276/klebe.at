"use client";

const OPTIONS = [
  { value: "white", swatch: "#f5f5f4" },
  { value: "black", swatch: "#111214" },
  { value: "gold", swatch: "#c9a227" },
  { value: "silver", swatch: "#b7b7b7" },
] as const;

export type Color = (typeof OPTIONS)[number]["value"];

export function ColorSelect({
  value,
  onChange,
  label,
}: {
  value: Color;
  onChange: (value: Color) => void;
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
            aria-label={option.value}
            onClick={() => onChange(option.value)}
            className={`w-9 h-9 rounded-full border-2 ${
              value === option.value ? "border-accent" : "border-white/20"
            }`}
            style={{ backgroundColor: option.swatch }}
          />
        ))}
      </div>
    </fieldset>
  );
}
