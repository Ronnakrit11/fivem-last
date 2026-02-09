import { prisma } from "@/lib/prisma";

export async function sendTelegramNotification(message: string) {
  try {
    const config = await prisma.telegramConfig.findFirst({
      where: { isActive: true },
    });

    if (!config || !config.botToken || !config.chatId) {
      return;
    }

    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}
