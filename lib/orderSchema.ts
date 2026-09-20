import { z } from "zod";

const dayHoursSchema = z.object({
  open: z.boolean(),
  from: z.string().min(1),
  to: z.string().min(1),
});

const weekScheduleSchema = z.object({
  sameEveryDay: z.boolean(),
  everyDay: dayHoursSchema,
  perDay: z.object({
    mon: dayHoursSchema,
    tue: dayHoursSchema,
    wed: dayHoursSchema,
    thu: dayHoursSchema,
    fri: dayHoursSchema,
    sat: dayHoursSchema,
    sun: dayHoursSchema,
  }),
});

const contactFieldsSchema = {
  name: z.string().min(1, "Name ist erforderlich"),
  phone: z.string().min(5, "Telefonnummer ist erforderlich"),
};

export const orderPayloadSchema = z.discriminatedUnion("path", [
  z.object({
    path: z.literal("quick"),
    ...contactFieldsSchema,
  }),
  z.object({
    path: z.literal("full"),
    ...contactFieldsSchema,
    quality: z.enum(["basic", "standard", "premium"]),
    color: z.enum(["white", "black", "gold", "silver"]),
    size: z.enum(["25x25", "30x30", "35x35"]),
    schedule: weekScheduleSchema,
    extraText: z.string().max(200).optional(),
  }),
]);

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
