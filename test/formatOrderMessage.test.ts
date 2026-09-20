import { describe, it, expect } from "vitest";
import { formatOrderMessage } from "@/lib/formatOrderMessage";
import type { OrderPayload } from "@/lib/orderSchema";

describe("formatOrderMessage", () => {
  it("formats a quick order", () => {
    const payload: OrderPayload = {
      path: "quick",
      name: "Herr Novak",
      phone: "+436601111111",
    };

    expect(formatOrderMessage(payload)).toBe(
      [
        "🆕 Neue Anfrage (Rückruf gewünscht)",
        "Name: Herr Novak",
        "Telefon: +436601111111",
      ].join("\n"),
    );
  });

  it("formats a full order including the schedule", () => {
    const payload: OrderPayload = {
      path: "full",
      name: "Frau Huber",
      phone: "+436601234567",
      quality: "premium",
      color: "black",
      size: "30x30",
      schedule: {
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
      },
      extraText: "www.beispiel-shop.at",
    };

    expect(formatOrderMessage(payload)).toBe(
      [
        "🆕 Neue Bestellung",
        "Name: Frau Huber",
        "Telefon: +436601234567",
        "Qualität: premium (8-10 Jahre)",
        "Farbe: black",
        "Größe: 30x30",
        "Öffnungszeiten:",
        "Mo–So: 08:00–18:00 Uhr",
        "Zusatztext: www.beispiel-shop.at",
      ].join("\n"),
    );
  });

  it("omits the Zusatztext line for a full order without extraText", () => {
    const payload: OrderPayload = {
      path: "full",
      name: "Frau Huber",
      phone: "+436601234567",
      quality: "standard",
      color: "black",
      size: "30x30",
      schedule: {
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
      },
    };

    const message = formatOrderMessage(payload);
    expect(message).not.toContain("Zusatztext:");
  });
});
