export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHours = {
  open: boolean;
  from: string;
  to: string;
};

export type WeekSchedule = {
  sameEveryDay: boolean;
  everyDay: DayHours;
  perDay: Record<DayKey, DayHours>;
};

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_LABEL_DE: Record<DayKey, string> = {
  mon: "Mo",
  tue: "Di",
  wed: "Mi",
  thu: "Do",
  fri: "Fr",
  sat: "Sa",
  sun: "So",
};

function formatInterval(hours: DayHours): string {
  return hours.open ? `${hours.from}–${hours.to} Uhr` : "geschlossen";
}

export function formatSchedule(schedule: WeekSchedule): string {
  if (schedule.sameEveryDay) {
    return `Mo–So: ${formatInterval(schedule.everyDay)}`;
  }

  return DAY_ORDER.map(
    (day) => `${DAY_LABEL_DE[day]}: ${formatInterval(schedule.perDay[day])}`,
  ).join("\n");
}
