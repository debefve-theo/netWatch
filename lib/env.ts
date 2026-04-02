const DEFAULT_OFFLINE_THRESHOLD_MINUTES = 10;
const DEFAULT_ALERT_MIN_DOWNLOAD_MBPS = 50;
const DEFAULT_ALERT_MIN_UPLOAD_MBPS = 3;
const DEFAULT_ALERT_COOLDOWN_MINUTES = 30;

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getAppUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export function getOfflineThresholdMinutes(): number {
  const raw = process.env.DEVICE_OFFLINE_THRESHOLD_MINUTES;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_OFFLINE_THRESHOLD_MINUTES;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_OFFLINE_THRESHOLD_MINUTES;
  }

  return parsed;
}

export function getOfflineThresholdMs(): number {
  return getOfflineThresholdMinutes() * 60_000;
}

export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? "NetWatch";
}

function getPositiveNumber(value: string | undefined, fallback: number): number {
  const parsed = value ? Number.parseFloat(value) : fallback;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function getAlertMinDownloadMbps(): number {
  return getPositiveNumber(process.env.ALERT_MIN_DOWNLOAD_MBPS, DEFAULT_ALERT_MIN_DOWNLOAD_MBPS);
}

export function getAlertMinUploadMbps(): number {
  return getPositiveNumber(process.env.ALERT_MIN_UPLOAD_MBPS, DEFAULT_ALERT_MIN_UPLOAD_MBPS);
}

export function getAlertCooldownMinutes(): number {
  return getPositiveNumber(process.env.ALERT_COOLDOWN_MINUTES, DEFAULT_ALERT_COOLDOWN_MINUTES);
}

export function getTelegramBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

export function getTelegramChatId(): string | null {
  return process.env.TELEGRAM_CHAT_ID ?? null;
}
