import type { Device, SpeedtestResult } from "@prisma/client";
import { getDeviceStatus } from "./device-status";
import type { DeviceDetail, DeviceSummary, SpeedtestRow } from "@/types";

export function serializeSpeedtestResult(result: SpeedtestResult): SpeedtestRow {
  return {
    id: result.id,
    deviceId: result.deviceId,
    measuredAt: result.measuredAt.toISOString(),
    pingMs: result.pingMs,
    jitterMs: result.jitterMs,
    downloadMbps: result.downloadMbps,
    uploadMbps: result.uploadMbps,
    packetLoss: result.packetLoss,
    isp: result.isp,
    externalIp: result.externalIp,
    serverId: result.serverId,
    serverName: result.serverName,
    serverLocation: result.serverLocation,
    serverCountry: result.serverCountry,
    resultUrl: result.resultUrl,
    createdAt: result.createdAt.toISOString(),
  };
}

type DeviceShape = Device & {
  _count?: {
    speedtestResults: number;
  };
  speedtestResults?: SpeedtestResult[];
};

export function serializeDevice(device: DeviceShape): DeviceSummary {
  const latestResult = device.speedtestResults?.[0] ?? null;

  return {
    id: device.id,
    name: device.name,
    locationLabel: device.locationLabel,
    enabled: device.enabled,
    createdAt: device.createdAt.toISOString(),
    updatedAt: device.updatedAt.toISOString(),
    lastSeenAt: device.lastSeenAt ? device.lastSeenAt.toISOString() : null,
    latestResultAt: latestResult ? latestResult.measuredAt.toISOString() : null,
    resultsCount: device._count?.speedtestResults ?? 0,
    status: getDeviceStatus(device.lastSeenAt),
  };
}

export function serializeDeviceDetail(device: DeviceShape): DeviceDetail {
  const base = serializeDevice(device);

  return {
    ...base,
    latestResult: device.speedtestResults?.[0]
      ? serializeSpeedtestResult(device.speedtestResults[0])
      : null,
  };
}
