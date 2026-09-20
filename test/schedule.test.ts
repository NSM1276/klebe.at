import { describe, it, expect } from "vitest";
import { formatSchedule, type WeekSchedule } from "@/lib/schedule";

describe("formatSchedule", () => {
  it("formats a single interval when the same hours apply every day", () => {
    const schedule: WeekSchedule = {
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

    expect(formatSchedule(schedule)).toBe("Mo–So: 08:00–18:00 Uhr");
  });

  it("formats one line per day when hours differ, marking closed days", () => {
    const schedule: WeekSchedule = {
      sameEveryDay: false,
      everyDay: { open: true, from: "08:00", to: "18:00" },
      perDay: {
        mon: { open: true, from: "08:00", to: "18:00" },
        tue: { open: true, from: "08:00", to: "18:00" },
        wed: { open: true, from: "08:00", to: "18:00" },
        thu: { open: true, from: "08:00", to: "18:00" },
        fri: { open: true, from: "08:00", to: "20:00" },
        sat: { open: true, from: "09:00", to: "13:00" },
        sun: { open: false, from: "08:00", to: "18:00" },
      },
    };

    expect(formatSchedule(schedule)).toBe(
      [
        "Mo: 08:00–18:00 Uhr",
        "Di: 08:00–18:00 Uhr",
        "Mi: 08:00–18:00 Uhr",
        "Do: 08:00–18:00 Uhr",
        "Fr: 08:00–20:00 Uhr",
        "Sa: 09:00–13:00 Uhr",
        "So: geschlossen",
      ].join("\n"),
    );
  });
});
