import { describe, it, expect } from "vitest";
import { orderPayloadSchema } from "@/lib/orderSchema";

const validFullOrder = {
  path: "full" as const,
  name: "Frau Huber",
  phone: "+436601234567",
  quality: "standard" as const,
  color: "white" as const,
  size: "30x30" as const,
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

describe("orderPayloadSchema", () => {
  it("accepts a valid full order", () => {
    const result = orderPayloadSchema.safeParse(validFullOrder);
    expect(result.success).toBe(true);
  });

  it("accepts a valid quick order (name + phone only)", () => {
    const result = orderPayloadSchema.safeParse({
      path: "quick",
      name: "Herr Novak",
      phone: "+436601111111",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a full order missing the size", () => {
    const { size, ...withoutSize } = validFullOrder;
    const result = orderPayloadSchema.safeParse(withoutSize);
    expect(result.success).toBe(false);
  });

  it("rejects an order with an empty phone number", () => {
    const result = orderPayloadSchema.safeParse({
      path: "quick",
      name: "Herr Novak",
      phone: "",
    });
    expect(result.success).toBe(false);
  });
});
