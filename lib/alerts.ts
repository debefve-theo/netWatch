import { prisma } from "./prisma";
import {
  getAlertCooldownMinutes,
  getAlertMinDownloadMbps,
  getAlertMinUploadMbps,
  getAppUrl,
  getTelegramBotToken,
  getTelegramChatId,
} from "./env";

type AlertDevice = {
  id: string;
  name: string;
  lastPerformanceAlertAt: Date | null;
};

type AlertSpeedtest = {
  measuredAt: Date;
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  packetLoss: number;
  resultUrl?: string | null;
};

function isBelowThreshold(result: AlertSpeedtest) {
  return (
    result.downloadMbps < getAlertMinDownloadMbps() ||
    result.uploadMbps < getAlertMinUploadMbps()
  );
}

function isCooldownElapsed(lastAlertAt: Date | null) {
  if (!lastAlertAt) {
    return true;
  }

  const cooldownMs = getAlertCooldownMinutes() * 60_000;
  return Date.now() - lastAlertAt.getTime() >= cooldownMs;
}

function escapeTelegram(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

async function sendTelegramMessage(message: string) {
  const token = getTelegramBotToken();
  const chatId = getTelegramChatId();

  if (!token || !chatId) {
    return false;
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram sendMessage failed (${response.status}): ${body}`);
  }

  return true;
}

export async function maybeSendPerformanceAlert(device: AlertDevice, result: AlertSpeedtest) {
  if (!isBelowThreshold(result) || !isCooldownElapsed(device.lastPerformanceAlertAt)) {
    return;
  }

  const appUrl = getAppUrl().replace(/\/+$/, "");
  const deviceUrl = `${appUrl}/dashboard/devices/${device.id}`;
  const message = [
    "🚨 *NetWatch alert*",
    "",
    `Device: *${escapeTelegram(device.name)}*`,
    `Measured at: ${escapeTelegram(result.measuredAt.toISOString())}`,
    `Download: *${escapeTelegram(result.downloadMbps.toFixed(2))} Mbps* \\(threshold ${escapeTelegram(getAlertMinDownloadMbps().toFixed(2))}\\)`,
    `Upload: *${escapeTelegram(result.uploadMbps.toFixed(2))} Mbps* \\(threshold ${escapeTelegram(getAlertMinUploadMbps().toFixed(2))}\\)`,
    `Ping: ${escapeTelegram(result.pingMs.toFixed(2))} ms`,
    `Jitter: ${escapeTelegram(result.jitterMs.toFixed(2))} ms`,
    `Packet loss: ${escapeTelegram(result.packetLoss.toFixed(2))}%`,
    "",
    `[Open device dashboard](${escapeTelegram(deviceUrl)})`,
    ...(result.resultUrl ? [`[Open Speedtest result](${escapeTelegram(result.resultUrl)})`] : []),
  ].join("\n");

  try {
    const sent = await sendTelegramMessage(message);
    if (!sent) {
      return;
    }

    await prisma.device.update({
      where: { id: device.id },
      data: { lastPerformanceAlertAt: new Date() },
    });
  } catch (error) {
    console.error("Telegram performance alert failed", error);
  }
}
