const DEFAULT_OFFLINE_THRESHOLD_MINUTES = 10;

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
