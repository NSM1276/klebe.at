"use client";

import type { DayHours, DayKey, WeekSchedule } from "@/lib/schedule";

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function TimeRow({
  hours,
  onChange,
}: {
  hours: DayHours;
  onChange: (hours: DayHours) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={hours.open}
        onChange={(event) => onChange({ ...hours, open: event.target.checked })}
      />
      <input
        type="time"
        value={hours.from}
        disabled={!hours.open}
        onChange={(event) => onChange({ ...hours, from: event.target.value })}
        className="bg-panel border border-white/20 rounded px-2 py-1 text-sm disabled:opacity-40"
      />
      <span className="text-white/50">–</span>
      <input
        type="time"
        value={hours.to}
        disabled={!hours.open}
        onChange={(event) => onChange({ ...hours, to: event.target.value })}
        className="bg-panel border border-white/20 rounded px-2 py-1 text-sm disabled:opacity-40"
      />
    </div>
  );
}

export function ScheduleBuilder({
  value,
  onChange,
  sameEveryDayLabel,
  dayLabels,
}: {
  value: WeekSchedule;
  onChange: (value: WeekSchedule) => void;
  sameEveryDayLabel: string;
  dayLabels: Record<DayKey, string>;
}) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={value.sameEveryDay}
          onChange={(event) =>
            onChange({ ...value, sameEveryDay: event.target.checked })
          }
        />
        {sameEveryDayLabel}
      </label>

      {value.sameEveryDay ? (
        <TimeRow
          hours={value.everyDay}
          onChange={(everyDay) => onChange({ ...value, everyDay })}
        />
      ) : (
        <div className="space-y-2">
          {DAY_ORDER.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-6 text-sm text-white/70">{dayLabels[day]}</span>
              <TimeRow
                hours={value.perDay[day]}
                onChange={(hours) =>
                  onChange({
                    ...value,
                    perDay: { ...value.perDay, [day]: hours },
                  })
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
