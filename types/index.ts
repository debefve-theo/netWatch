/** Shared TypeScript types across the application. */

export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";
export type DeviceStatus = "online" | "offline" | "unknown";

export interface DeviceSummary {
  id: string;
  name: string;
  locationLabel: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string | null;
  latestResultAt: string | null;
  resultsCount: number;
  status: DeviceStatus;
}

export interface DeviceDetail extends DeviceSummary {
  latestResult: SpeedtestRow | null;
}

export interface SpeedtestRow {
  id: string;
  deviceId: string;
  measuredAt: string;
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  packetLoss: number;
  isp: string | null;
  externalIp: string | null;
  serverId: string | null;
  serverName: string | null;
  serverLocation: string | null;
  serverCountry: string | null;
  resultUrl: string | null;
  createdAt: string;
}

export interface SpeedtestPage {
  data: SpeedtestRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OverviewStats {
  device: DeviceDetail;
  deviceId: string;
  range: TimeRange;
  totalTests: number;
  avgDownloadMbps: number;
  avgUploadMbps: number;
  avgPingMs: number;
  avgJitterMs: number;
  avgPacketLoss: number;
  maxDownloadMbps: number;
  minDownloadMbps: number;
  maxUploadMbps: number;
  minUploadMbps: number;
  minPingMs: number;
  maxPingMs: number;
  latestResult: SpeedtestRow | null;
}
