/**
 * Device online/offline detection logic.
 * A device is "online" if its lastSeenAt is within THRESHOLD minutes.
 */

import { getOfflineThresholdMinutes, getOfflineThresholdMs } from "./env";

export type DeviceStatus = "online" | "offline" | "unknown";

export function getDeviceStatus(lastSeenAt: Date | null | undefined): DeviceStatus {
  if (!lastSeenAt) return "unknown";
  const age = Date.now() - new Date(lastSeenAt).getTime();
  return age <= getOfflineThresholdMs() ? "online" : "offline";
}

export function getThresholdMinutes(): number {
  return getOfflineThresholdMinutes();
}
