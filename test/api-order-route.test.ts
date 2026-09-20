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
