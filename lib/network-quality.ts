import type { SpeedtestRow } from "@/types";

export type NetworkQuality = "excellent" | "good" | "fair" | "poor" | "unknown";

export function getNetworkQuality(result: SpeedtestRow | null | undefined): NetworkQuality {
  if (!result) {
    return "unknown";
  }

  let score = 100;

  if (result.pingMs > 25) score -= 15;
  if (result.pingMs > 60) score -= 15;
  if (result.jitterMs > 8) score -= 10;
  if (result.jitterMs > 20) score -= 10;
  if (result.packetLoss > 0.5) score -= 20;
  if (result.packetLoss > 2) score -= 20;
  if (result.downloadMbps < 50) score -= 5;
  if (result.downloadMbps < 20) score -= 10;
  if (result.uploadMbps < 10) score -= 5;
  if (result.uploadMbps < 5) score -= 10;

  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 45) return "fair";
  return "poor";
}
