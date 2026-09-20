# klebe.at Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the klebe.at one-page marketing/order site for a vinyl-decal business (opening-hours stickers for shops in Vienna), where an order form sends the customer's choices straight to the owner's Telegram, with no payment and no database.

**Architecture:** Single Next.js App Router page composed of section components (Hero, How-it-works, Gallery, Pricing, Order Form, Delivery Zone, Footer). The order form's business logic (schedule formatting, validation, message formatting) lives in plain, unit-tested TypeScript modules under `lib/`, called from one API route (`/api/order`) that forwards a formatted message to a Telegram bot via `fetch`. No database — Telegram *is* the order inbox. Language switching (DE default / EN) is a client-side dictionary swap, not routed URLs, to keep the site as simple as the spec asks for.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Framer Motion, Zod (validation), Vitest (unit tests), deployed on Vercel.

**Reference spec:** `PROJECT.md` in the project root — read it for full business context before starting.

---

## File Structure

```
öffnugszeiten web/
├── PROJECT.md                          # business spec (already exists)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
├── .env.local.example
├── .gitignore
├── app/
│   ├── layout.tsx                      # root HTML shell, fonts, metadata
│   ├── page.tsx                        # assembles all sections
│   ├── globals.css                     # Tailwind directives + base styles
│   └── api/
│       └── order/
│           └── route.ts                # POST handler -> Telegram
├── components/
│   ├── LanguageProvider.tsx            # DE/EN context + toggle
│   ├── AnimatedSection.tsx             # Framer Motion scroll-reveal wrapper
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── Gallery.tsx
│   ├── Pricing.tsx
│   ├── DeliveryZone.tsx
│   ├── Footer.tsx
│   └── order-form/
│       ├── OrderForm.tsx               # path switch (quick vs full) + submit
│       ├── QualitySelect.tsx
│       ├── ColorSelect.tsx
│       ├── SizeSelect.tsx
│       └── ScheduleBuilder.tsx
├── lib/
│   ├── i18n/
│   │   ├── dictionary.ts               # DE/EN strings
│   │   └── types.ts
│   ├── schedule.ts                     # WeekSchedule type + formatSchedule()
│   ├── orderSchema.ts                  # Zod schemas + OrderPayload type
│   ├── formatOrderMessage.ts           # OrderPayload -> Telegram text
│   └── telegram.ts                     # sendTelegramOrderNotification()
└── test/
    ├── schedule.test.ts
    ├── orderSchema.test.ts
    ├── formatOrderMessage.test.ts
    ├── telegram.test.ts
    └── api-order-route.test.ts
```

**Responsibility boundaries:**
- `lib/schedule.ts` — pure data → string formatting, no knowledge of forms or Telegram.
- `lib/orderSchema.ts` — pure validation, no knowledge of Telegram or UI.
- `lib/formatOrderMessage.ts` — turns a validated `OrderPayload` into the exact text sent to Telegram. Depends on `schedule.ts` for the schedule lines.
- `lib/telegram.ts` — the only module that knows the Telegram HTTP API.
- `app/api/order/route.ts` — wires validation → formatting → sending, and maps errors to HTTP responses. No business logic of its own.
- `components/order-form/*` — UI only; calls `fetch('/api/order')` and never talks to Telegram directly.

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "klebe-at-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111214",
        panel: "#1b1c1f",
        accent: "#ff6a1a",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
.next/
.env.local
*.log
```

- [ ] **Step 7: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #111214;
  color: #f5f5f4;
}
```

- [ ] **Step 8: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "klebe.at — Öffnungszeiten-Aufkleber für Ihr Geschäft",
  description:
    "Professionelle Aufkleber mit Ihren Öffnungszeiten aus Folie statt handgeschriebenem Zettel. Bestellen Sie online, wir kleben in Wien direkt vor Ort.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Create a placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">klebe.at</h1>
    </main>
  );
}
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 11: Verify the dev server runs**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000`; open it (or use the built-in browser preview) and confirm the page shows "klebe.at" on a dark background. Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 12: Commit**

```bash
git init
git add package.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.js .gitignore app PROJECT.md docs
git commit -m "chore: scaffold Next.js project"
```

---

## Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `test/sanity.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Write a sanity test**

```ts
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run it**

Run: `npx vitest run`
Expected: 1 test passes.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts test/sanity.test.ts
git commit -m "chore: configure vitest"
```

---

## Task 3: Schedule formatting logic (TDD)

**Files:**
- Create: `lib/schedule.ts`
- Test: `test/schedule.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
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
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run test/schedule.test.ts`
Expected: FAIL — `Cannot find module '@/lib/schedule'`.

- [ ] **Step 3: Implement `lib/schedule.ts`**

```ts
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
```

- [ ] **Step 4: Run the tests again to confirm they pass**

Run: `npx vitest run test/schedule.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/schedule.ts test/schedule.test.ts
git commit -m "feat: add schedule formatting logic"
```

---

## Task 4: Order validation schema (TDD)

**Files:**
- Create: `lib/orderSchema.ts`
- Test: `test/orderSchema.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
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
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run test/orderSchema.test.ts`
Expected: FAIL — `Cannot find module '@/lib/orderSchema'`.

- [ ] **Step 3: Implement `lib/orderSchema.ts`**

```ts
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
```

- [ ] **Step 4: Run the tests again to confirm they pass**

Run: `npx vitest run test/orderSchema.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/orderSchema.ts test/orderSchema.test.ts
git commit -m "feat: add order validation schema"
```

---

## Task 5: Format the Telegram message (TDD)

**Files:**
- Create: `lib/formatOrderMessage.ts`
- Test: `test/formatOrderMessage.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
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
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run test/formatOrderMessage.test.ts`
Expected: FAIL — `Cannot find module '@/lib/formatOrderMessage'`.

- [ ] **Step 3: Implement `lib/formatOrderMessage.ts`**

```ts
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
```

- [ ] **Step 4: Run the tests again to confirm they pass**

Run: `npx vitest run test/formatOrderMessage.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/formatOrderMessage.ts test/formatOrderMessage.test.ts
git commit -m "feat: format order payload into a Telegram message"
```

---

## Task 6: Telegram notification sender (TDD)

**Files:**
- Create: `lib/telegram.ts`
- Test: `test/telegram.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendTelegramOrderNotification } from "@/lib/telegram";

describe("sendTelegramOrderNotification", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "12345");
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("posts the message to the Telegram sendMessage endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await sendTelegramOrderNotification("hello world");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: "12345", text: "hello world" }),
      },
    );
  });

  it("throws when Telegram responds with an error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, description: "bad request" }),
    }) as unknown as typeof fetch;

    await expect(sendTelegramOrderNotification("hello")).rejects.toThrow(
      "bad request",
    );
  });

  it("throws when the bot token or chat id env vars are missing", async () => {
    vi.unstubAllEnvs();
    await expect(sendTelegramOrderNotification("hello")).rejects.toThrow(
      /TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID/,
    );
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run test/telegram.test.ts`
Expected: FAIL — `Cannot find module '@/lib/telegram'`.

- [ ] **Step 3: Implement `lib/telegram.ts`**

```ts
export async function sendTelegramOrderNotification(
  text: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error(
      "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variable",
    );
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.description ?? "Telegram request failed");
  }
}
```

- [ ] **Step 4: Run the tests again to confirm they pass**

Run: `npx vitest run test/telegram.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram.ts test/telegram.test.ts
git commit -m "feat: add Telegram order notification sender"
```

---

## Task 7: `/api/order` route (TDD)

**Files:**
- Create: `app/api/order/route.ts`
- Test: `test/api-order-route.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/telegram", () => ({
  sendTelegramOrderNotification: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/order/route";
import { sendTelegramOrderNotification } from "@/lib/telegram";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/order", () => {
  beforeEach(() => {
    vi.mocked(sendTelegramOrderNotification).mockClear();
  });

  it("sends a Telegram notification and returns 200 for a valid quick order", async () => {
    const response = await POST(
      makeRequest({ path: "quick", name: "Herr Novak", phone: "+436601111111" }),
    );

    expect(response.status).toBe(200);
    expect(sendTelegramOrderNotification).toHaveBeenCalledTimes(1);
    const [message] = vi.mocked(sendTelegramOrderNotification).mock.calls[0];
    expect(message).toContain("Herr Novak");
  });

  it("returns 400 and does not call Telegram for an invalid payload", async () => {
    const response = await POST(makeRequest({ path: "quick", name: "" }));

    expect(response.status).toBe(400);
    expect(sendTelegramOrderNotification).not.toHaveBeenCalled();
  });

  it("returns 502 when the Telegram call fails", async () => {
    vi.mocked(sendTelegramOrderNotification).mockRejectedValueOnce(
      new Error("boom"),
    );

    const response = await POST(
      makeRequest({ path: "quick", name: "Herr Novak", phone: "+436601111111" }),
    );

    expect(response.status).toBe(502);
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run test/api-order-route.test.ts`
Expected: FAIL — `Cannot find module '@/app/api/order/route'`.

- [ ] **Step 3: Implement `app/api/order/route.ts`**

```ts
import { NextResponse } from "next/server";
import { orderPayloadSchema } from "@/lib/orderSchema";
import { formatOrderMessage } from "@/lib/formatOrderMessage";
import { sendTelegramOrderNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = orderPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const message = formatOrderMessage(parsed.data);

  try {
    await sendTelegramOrderNotification(message);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "notification_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run the tests again to confirm they pass**

Run: `npx vitest run test/api-order-route.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: all tests across every file pass (schedule, orderSchema, formatOrderMessage, telegram, api-order-route, sanity).

- [ ] **Step 6: Commit**

```bash
git add app/api/order/route.ts test/api-order-route.test.ts
git commit -m "feat: add /api/order route wiring validation, formatting and Telegram"
```

---

## Task 8: Language dictionary and provider

**Files:**
- Create: `lib/i18n/types.ts`
- Create: `lib/i18n/dictionary.ts`
- Create: `components/LanguageProvider.tsx`

- [ ] **Step 1: Create `lib/i18n/types.ts`**

```ts
export type Locale = "de" | "en";

export type Dictionary = {
  nav: { orderCta: string };
  hero: { title: string; subtitle: string; cta: string };
  howItWorks: {
    title: string;
    steps: { title: string; text: string }[];
  };
  gallery: { title: string };
  pricing: {
    title: string;
    qualityLabel: string;
    sizeLabel: string;
    quality: { basic: string; standard: string; premium: string };
  };
  deliveryZone: {
    title: string;
    vienna: string;
    other: string;
  };
  footer: { contactTitle: string };
  orderForm: {
    title: string;
    pathFull: string;
    pathQuick: string;
    nameLabel: string;
    phoneLabel: string;
    qualityLabel: string;
    colorLabel: string;
    sizeLabel: string;
    scheduleTitle: string;
    sameEveryDayLabel: string;
    extraTextLabel: string;
    submit: string;
    successMessage: string;
    errorMessage: string;
  };
};
```

- [ ] **Step 2: Create `lib/i18n/dictionary.ts`**

```ts
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = {
  de: {
    nav: { orderCta: "Jetzt bestellen" },
    hero: {
      title: "Ihre Öffnungszeiten. Professionell geklebt.",
      subtitle:
        "Aufkleber aus Folie statt handgeschriebenem Zettel — in Wien kleben wir direkt vor Ort, überall sonst schicken wir ihn per Post.",
      cta: "Jetzt bestellen",
    },
    howItWorks: {
      title: "So funktioniert's",
      steps: [
        { title: "Auswählen", text: "Farbe, Größe und Öffnungszeiten festlegen." },
        { title: "Absenden", text: "Bestellung abschicken, wir melden uns." },
        { title: "Fertig", text: "Wir kleben es in Wien, oder Sie kleben es selbst nach Postversand." },
      ],
    },
    gallery: { title: "Beispiele" },
    pricing: {
      title: "Preise",
      qualityLabel: "Qualität",
      sizeLabel: "Größe",
      quality: {
        basic: "Basic (3 Jahre)",
        standard: "Standard (5 Jahre)",
        premium: "Premium (8-10 Jahre)",
      },
    },
    deliveryZone: {
      title: "Lieferung",
      vienna: "Wien — wir kommen vorbei und kleben es an Ort und Stelle.",
      other: "Außerhalb Wiens — wir schicken den fertigen Aufkleber per Post, Sie kleben ihn selbst.",
    },
    footer: { contactTitle: "Kontakt" },
    orderForm: {
      title: "Bestellung aufgeben",
      pathFull: "Selbst konfigurieren",
      pathQuick: "Nur Kontakt hinterlassen",
      nameLabel: "Name",
      phoneLabel: "Telefon",
      qualityLabel: "Qualität",
      colorLabel: "Farbe",
      sizeLabel: "Größe",
      scheduleTitle: "Öffnungszeiten",
      sameEveryDayLabel: "Jeden Tag dieselben Zeiten",
      extraTextLabel: "Zusatztext (optional)",
      submit: "Absenden",
      successMessage: "Danke! Wir melden uns telefonisch bei Ihnen.",
      errorMessage: "Etwas ist schiefgelaufen. Bitte rufen Sie uns direkt an.",
    },
  },
  en: {
    nav: { orderCta: "Order now" },
    hero: {
      title: "Your opening hours. Professionally applied.",
      subtitle:
        "A vinyl sticker instead of a handwritten note — in Vienna we install it for you, anywhere else we mail it and you apply it yourself.",
      cta: "Order now",
    },
    howItWorks: {
      title: "How it works",
      steps: [
        { title: "Choose", text: "Pick color, size and your opening hours." },
        { title: "Send", text: "Submit the order, we'll get in touch." },
        { title: "Done", text: "We install it in Vienna, or you apply it yourself after we mail it." },
      ],
    },
    gallery: { title: "Examples" },
    pricing: {
      title: "Pricing",
      qualityLabel: "Quality",
      sizeLabel: "Size",
      quality: {
        basic: "Basic (3 years)",
        standard: "Standard (5 years)",
        premium: "Premium (8-10 years)",
      },
    },
    deliveryZone: {
      title: "Delivery",
      vienna: "Vienna — we come by and install it on site.",
      other: "Outside Vienna — we mail the finished sticker, you apply it yourself.",
    },
    footer: { contactTitle: "Contact" },
    orderForm: {
      title: "Place an order",
      pathFull: "Configure it myself",
      pathQuick: "Just leave my contact",
      nameLabel: "Name",
      phoneLabel: "Phone",
      qualityLabel: "Quality",
      colorLabel: "Color",
      sizeLabel: "Size",
      scheduleTitle: "Opening hours",
      sameEveryDayLabel: "Same hours every day",
      extraTextLabel: "Extra text (optional)",
      submit: "Submit",
      successMessage: "Thanks! We'll call you back.",
      errorMessage: "Something went wrong. Please call us directly.",
    },
  },
};
```

- [ ] **Step 3: Create `components/LanguageProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Dictionary, Locale } from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("de");

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/i18n components/LanguageProvider.tsx
git commit -m "feat: add DE/EN dictionary and language provider"
```

---

## Task 9: Order form UI

**Files:**
- Create: `components/order-form/QualitySelect.tsx`
- Create: `components/order-form/ColorSelect.tsx`
- Create: `components/order-form/SizeSelect.tsx`
- Create: `components/order-form/ScheduleBuilder.tsx`
- Create: `components/order-form/OrderForm.tsx`

- [ ] **Step 1: Create `components/order-form/QualitySelect.tsx`**

```tsx
"use client";

const OPTIONS = [
  { value: "basic", years: 3 },
  { value: "standard", years: 5 },
  { value: "premium", years: 10 },
] as const;

export type Quality = (typeof OPTIONS)[number]["value"];

export function QualitySelect({
  value,
  onChange,
  label,
}: {
  value: Quality;
  onChange: (value: Quality) => void;
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
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md border text-sm ${
              value === option.value
                ? "bg-accent border-accent text-black"
                : "border-white/20 text-white"
            }`}
          >
            {option.value} · {option.years}J
          </button>
        ))}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 2: Create `components/order-form/ColorSelect.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `components/order-form/SizeSelect.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `components/order-form/ScheduleBuilder.tsx`**

```tsx
"use client";

import type { DayHours, DayKey, WeekSchedule } from "@/lib/schedule";

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL: Record<DayKey, string> = {
  mon: "Mo",
  tue: "Di",
  wed: "Mi",
  thu: "Do",
  fri: "Fr",
  sat: "Sa",
  sun: "So",
};

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
}: {
  value: WeekSchedule;
  onChange: (value: WeekSchedule) => void;
  sameEveryDayLabel: string;
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
              <span className="w-6 text-sm text-white/70">{DAY_LABEL[day]}</span>
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
```

- [ ] **Step 5: Create `components/order-form/OrderForm.tsx`**

```tsx
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
```

- [ ] **Step 6: Commit**

```bash
git add components/order-form
git commit -m "feat: build order form UI (quick and full paths)"
```

---

## Task 10: Page sections and assembly

**Files:**
- Create: `components/AnimatedSection.tsx`
- Create: `components/Hero.tsx`
- Create: `components/HowItWorks.tsx`
- Create: `components/Gallery.tsx`
- Create: `components/Pricing.tsx`
- Create: `components/DeliveryZone.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/AnimatedSection.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export function AnimatedSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 2: Create `components/Hero.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
        {t.hero.title}
      </h1>
      <p className="mt-6 text-lg text-white/70 max-w-xl">{t.hero.subtitle}</p>
      <a
        href="#order"
        className="mt-8 inline-block bg-accent text-black font-semibold px-6 py-3 rounded-md"
      >
        {t.hero.cta}
      </a>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/HowItWorks.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.howItWorks.title}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {t.howItWorks.steps.map((step, index) => (
          <div key={step.title} className="bg-panel rounded-lg p-6">
            <span className="text-accent text-sm font-semibold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-white font-semibold mt-2">{step.title}</h3>
            <p className="text-white/70 text-sm mt-1">{step.text}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 4: Create `components/Gallery.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

const PLACEHOLDER_IMAGES = ["/gallery/example-1.jpg", "/gallery/example-2.jpg", "/gallery/example-3.jpg"];

export function Gallery() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.gallery.title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_IMAGES.map((src) => (
          <div key={src} className="aspect-square bg-panel rounded-lg overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 5: Create `components/Pricing.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

const SIZES = ["25x25", "30x30", "35x35"];
const PRICES: Record<string, Record<string, string>> = {
  basic: { "25x25": "25€", "30x30": "30€", "35x35": "35€" },
  standard: { "25x25": "30€", "30x30": "35€", "35x35": "40€" },
  premium: { "25x25": "40€", "30x30": "45€", "35x35": "50€" },
};

export function Pricing() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.pricing.title}</h2>
      <table className="w-full text-left text-white/80 text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="py-2">{t.pricing.qualityLabel}</th>
            {SIZES.map((size) => (
              <th key={size} className="py-2">{size} cm</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Object.keys(PRICES) as Array<keyof typeof t.pricing.quality>).map((quality) => (
            <tr key={quality} className="border-b border-white/10">
              <td className="py-2">{t.pricing.quality[quality]}</td>
              {SIZES.map((size) => (
                <td key={size} className="py-2">{PRICES[quality][size]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </AnimatedSection>
  );
}
```

- [ ] **Step 6: Create `components/DeliveryZone.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

export function DeliveryZone() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.deliveryZone.title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-panel rounded-lg p-6 text-white/80">{t.deliveryZone.vienna}</div>
        <div className="bg-panel rounded-lg p-6 text-white/80">{t.deliveryZone.other}</div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 7: Create `components/Footer.tsx`**

```tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="px-6 py-12 border-t border-white/10 text-center text-white/60 text-sm">
      <p>{t.footer.contactTitle}: +43 660 0000000 · Telegram @klebe_at</p>
      <p className="mt-2">klebe.at</p>
    </footer>
  );
}
```

- [ ] **Step 8: Assemble `app/page.tsx`**

```tsx
import { LanguageProvider } from "@/components/LanguageProvider";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Pricing } from "@/components/Pricing";
import { DeliveryZone } from "@/components/DeliveryZone";
import { Footer } from "@/components/Footer";
import { OrderForm } from "@/components/order-form/OrderForm";

export default function Home() {
  return (
    <LanguageProvider>
      <main>
        <Hero />
        <HowItWorks />
        <Gallery />
        <Pricing />
        <section id="order" className="px-6 py-16 max-w-4xl mx-auto">
          <OrderForm />
        </section>
        <DeliveryZone />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
```

- [ ] **Step 9: Run the dev server and check the page manually**

Run: `npm run dev`
Expected: visiting `http://localhost:3000` shows Hero → How it works → Gallery → Pricing → Order form → Delivery zone → Footer, dark background with orange accents, sections fade in on scroll. Submitting the order form (with a real `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` set, see Task 11) shows the success message.

- [ ] **Step 10: Commit**

```bash
git add components app/page.tsx
git commit -m "feat: assemble homepage sections"
```

---

## Task 11: Environment variables and Telegram bot setup

**Files:**
- Create: `.env.local.example`
- Modify: `PROJECT.md`

- [ ] **Step 1: Create `.env.local.example`**

```
# Create a bot via @BotFather on Telegram, copy the token it gives you.
TELEGRAM_BOT_TOKEN=

# Send any message to your bot, then open:
# https://api.telegram.org/bot<TOKEN>/getUpdates
# and copy the "chat":{"id": ...} value.
TELEGRAM_CHAT_ID=
```

- [ ] **Step 2: Create your real `.env.local` (not committed)**

Copy `.env.local.example` to `.env.local` and fill in the real token and chat id once the bot exists. `.env.local` is already listed in `.gitignore` from Task 1.

- [ ] **Step 3: Verify the order form actually reaches Telegram**

Run: `npm run dev`, submit the order form on `http://localhost:3000#order`.
Expected: a message formatted like the ones in `test/formatOrderMessage.test.ts` arrives in the Telegram chat identified by `TELEGRAM_CHAT_ID`.

- [ ] **Step 4: Add deployment notes to `PROJECT.md`**

Append this section to `PROJECT.md`:

```markdown
## Деплой (Vercel)

1. Запушить репозиторий на GitHub.
2. Импортировать проект в Vercel (vercel.com → New Project → выбрать репозиторий).
3. В настройках проекта Vercel → Environment Variables добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (те же значения, что в `.env.local`).
4. Deploy. Позже подключить домен klebe.at в Vercel → Settings → Domains.
```

- [ ] **Step 5: Commit**

```bash
git add .env.local.example PROJECT.md
git commit -m "docs: add env var template and deployment notes"
```

---

## Self-Review Notes

- **Spec coverage:** Telegram-only order flow (Task 6-7), two-path form incl. schedule builder (Task 9), quality/color/size options with the exact values from `PROJECT.md` (Tasks 3-5, 9), DE/EN dictionary (Task 8), dark+orange industrial styling (Tailwind config in Task 1, components in Task 10), Framer Motion scroll reveal (Task 10), delivery zone + pricing + gallery sections (Task 10), Telegram bot creation + Vercel deploy notes (Task 11) — all covered. Card/flyer design and Google Business Profile are explicitly out of scope for this plan (tracked as separate TODOs in `PROJECT.md`).
- **Placeholder scan:** no TBD/TODO markers inside task steps; gallery images use literal placeholder paths (`/gallery/example-*.jpg`) which is a real, intentional stand-in until the owner supplies photos — tracked in `PROJECT.md`'s open questions, not a plan gap.
- **Type consistency:** `WeekSchedule`/`DayHours`/`DayKey` (Task 3) are reused as-is by `orderSchema.ts` (Task 4), `formatOrderMessage.ts` (Task 5), and `ScheduleBuilder.tsx` (Task 9) — same field names throughout (`sameEveryDay`, `everyDay`, `perDay`, `open`/`from`/`to`). `OrderPayload` (Task 4) is the single type flowing through `formatOrderMessage` (Task 5), the API route (Task 7), and `OrderForm.tsx` (Task 9).
