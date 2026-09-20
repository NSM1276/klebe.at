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
