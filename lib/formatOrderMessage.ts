import { formatSchedule } from "@/lib/schedule";
import type { OrderPayload } from "@/lib/orderSchema";

const QUALITY_LABEL: Record<string, string> = {
  basic: "basic (3 Jahre)",
  standard: "standard (5 Jahre)",
  premium: "premium (8-10 Jahre)",
};

export function formatOrderMessage(payload: OrderPayload): string {
  if (payload.path === "quick") {
    return [
      "🆕 Neue Anfrage (Rückruf gewünscht)",
      `Name: ${payload.name}`,
      `Telefon: ${payload.phone}`,
    ].join("\n");
  }

  const lines = [
    "🆕 Neue Bestellung",
    `Name: ${payload.name}`,
    `Telefon: ${payload.phone}`,
    `Qualität: ${QUALITY_LABEL[payload.quality]}`,
    `Farbe: ${payload.color}`,
    `Größe: ${payload.size}`,
    "Öffnungszeiten:",
    formatSchedule(payload.schedule),
  ];

  if (payload.extraText) {
    lines.push(`Zusatztext: ${payload.extraText}`);
  }

  return lines.join("\n");
}
