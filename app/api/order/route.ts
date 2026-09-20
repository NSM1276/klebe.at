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
