"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { QualitySelect, type Quality } from "@/components/order-form/QualitySelect";
import { ColorSelect, type Color } from "@/components/order-form/ColorSelect";
import { SizeSelect, type Size } from "@/components/order-form/SizeSelect";
import { ScheduleBuilder } from "@/components/order-form/ScheduleBuilder";
import type { WeekSchedule } from "@/lib/schedule";

const DEFAULT_SCHEDULE: WeekSchedule = {
  sameEveryDay: true,
  everyDay: { open: true, from: "08:00", to: "18:00" },
  perDay: {
    mon: { open: true, from: "08:00", to: "18:00" },
    tue: { open: true, from: "08:00", to: "18:00" },
    wed: { open: true, from: "08:00", to: "18:00" },
    thu: { open: true, from: "08:00", to: "18:00" },
    fri: { open: true, from: "08:00", to: "18:00" },
    sat: { open: true, from: "08:00", to: "18:00" },
    sun: { open: true, from: "08:00", to: "18:00" },
  },
};

type SubmitState = "idle" | "sending" | "success" | "error";

export function OrderForm() {
  const { t } = useLanguage();
  const [path, setPath] = useState<"full" | "quick">("full");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quality, setQuality] = useState<Quality>("standard");
  const [color, setColor] = useState<Color>("white");
  const [size, setSize] = useState<Size>("30x30");
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);
  const [extraText, setExtraText] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");

    const payload =
      path === "quick"
        ? { path: "quick" as const, name, phone }
        : {
            path: "full" as const,
            name,
            phone,
            quality,
            color,
            size,
            schedule,
            extraText: extraText || undefined,
          };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setState(response.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return <p className="text-accent text-lg">{t.orderForm.successMessage}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPath("full")}
          className={`px-4 py-2 rounded-md text-sm ${
            path === "full" ? "bg-accent text-black" : "border border-white/20 text-white"
          }`}
        >
          {t.orderForm.pathFull}
        </button>
        <button
          type="button"
          onClick={() => setPath("quick")}
          className={`px-4 py-2 rounded-md text-sm ${
            path === "quick" ? "bg-accent text-black" : "border border-white/20 text-white"
          }`}
        >
          {t.orderForm.pathQuick}
        </button>
      </div>

      {path === "full" && (
        <>
          <QualitySelect value={quality} onChange={setQuality} label={t.orderForm.qualityLabel} />
          <ColorSelect value={color} onChange={setColor} label={t.orderForm.colorLabel} />
          <SizeSelect value={size} onChange={setSize} label={t.orderForm.sizeLabel} />
          <div>
            <p className="text-sm text-white/70 mb-2">{t.orderForm.scheduleTitle}</p>
            <ScheduleBuilder
              value={schedule}
              onChange={setSchedule}
              sameEveryDayLabel={t.orderForm.sameEveryDayLabel}
            />
          </div>
          <label className="block">
            <span className="text-sm text-white/70">{t.orderForm.extraTextLabel}</span>
            <input
              type="text"
              value={extraText}
              onChange={(event) => setExtraText(event.target.value)}
              maxLength={200}
              className="mt-1 w-full bg-panel border border-white/20 rounded px-3 py-2 text-white"
            />
          </label>
        </>
      )}

      <label className="block">
        <span className="text-sm text-white/70">{t.orderForm.nameLabel}</span>
        <input
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full bg-panel border border-white/20 rounded px-3 py-2 text-white"
        />
      </label>

      <label className="block">
        <span className="text-sm text-white/70">{t.orderForm.phoneLabel}</span>
        <input
          required
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-1 w-full bg-panel border border-white/20 rounded px-3 py-2 text-white"
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-accent text-black font-semibold px-6 py-3 rounded-md disabled:opacity-50"
      >
        {t.orderForm.submit}
      </button>

      {state === "error" && (
        <p className="text-red-400 text-sm">{t.orderForm.errorMessage}</p>
      )}
    </form>
  );
}
