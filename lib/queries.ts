import { prisma } from "./prisma";
import { rangeToDate } from "./utils";
import { serializeDevice, serializeDeviceDetail, serializeSpeedtestResult } from "./serializers";
import type {
  DeviceDetail,
  DeviceSummary,
  OverviewStats,
  SpeedtestPage,
  TimeRange,
} from "@/types";

export async function listDevices(): Promise<DeviceSummary[]> {
  const devices = await prisma.device.findMany({
    orderBy: [{ enabled: "desc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          speedtestResults: true,
        },
      },
      speedtestResults: {
        orderBy: {
          measuredAt: "desc",
        },
        take: 1,
      },
    },
  });

  return devices.map(serializeDevice);
}

export async function getDeviceDetail(deviceId: string): Promise<DeviceDetail | null> {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      _count: {
        select: {
          speedtestResults: true,
        },
      },
      speedtestResults: {
        orderBy: {
          measuredAt: "desc",
        },
        take: 1,
      },
    },
  });

  return device ? serializeDeviceDetail(device) : null;
}

export async function getOverviewStats(
  deviceId: string,
  range: TimeRange,
): Promise<OverviewStats | null> {
  const since = rangeToDate(range);

  const [device, aggregate, latestResult] = await Promise.all([
    getDeviceDetail(deviceId),
    prisma.speedtestResult.aggregate({
      where: {
        deviceId,
        measuredAt: {
          gte: since,
        },
      },
      _avg: {
        downloadMbps: true,
        uploadMbps: true,
        pingMs: true,
        jitterMs: true,
        packetLoss: true,
      },
      _min: {
        downloadMbps: true,
        uploadMbps: true,
        pingMs: true,
      },
      _max: {
        downloadMbps: true,
        uploadMbps: true,
        pingMs: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.speedtestResult.findFirst({
      where: { deviceId },
      orderBy: {
        measuredAt: "desc",
      },
    }),
  ]);

  if (!device) {
    return null;
  }

  return {
    device,
    deviceId,
    range,
    totalTests: aggregate._count._all,
    avgDownloadMbps: aggregate._avg.downloadMbps ?? 0,
    avgUploadMbps: aggregate._avg.uploadMbps ?? 0,
    avgPingMs: aggregate._avg.pingMs ?? 0,
    avgJitterMs: aggregate._avg.jitterMs ?? 0,
    avgPacketLoss: aggregate._avg.packetLoss ?? 0,
    maxDownloadMbps: aggregate._max.downloadMbps ?? 0,
    minDownloadMbps: aggregate._min.downloadMbps ?? 0,
    maxUploadMbps: aggregate._max.uploadMbps ?? 0,
    minUploadMbps: aggregate._min.uploadMbps ?? 0,
    minPingMs: aggregate._min.pingMs ?? 0,
    maxPingMs: aggregate._max.pingMs ?? 0,
    latestResult: latestResult ? serializeSpeedtestResult(latestResult) : null,
  };
}

/**
 * Fetch all chart data points for a device in a given range.
 * Returns them oldest-first so charts render left→right chronologically.
 * No pagination — fetches everything (capped at 2000 rows to avoid OOM).
 */
export async function getChartData(deviceId: string, range: TimeRange) {
  const since = rangeToDate(range);
  const rows = await prisma.speedtestResult.findMany({
    where: { deviceId, measuredAt: { gte: since } },
    orderBy: { measuredAt: "asc" },
    take: 2000,
    select: {
      id: true,
      deviceId: true,
      measuredAt: true,
      downloadMbps: true,
      uploadMbps: true,
      pingMs: true,
      jitterMs: true,
      packetLoss: true,
      isp: true,
      externalIp: true,
      serverId: true,
      serverName: true,
      serverLocation: true,
      serverCountry: true,
      resultUrl: true,
      createdAt: true,
    },
  });
  return rows.map(serializeSpeedtestResult);
}

export async function getGlobalHistory(input: {
  deviceId?: string;
  range: TimeRange;
  page?: number;
  pageSize?: number;
}): Promise<SpeedtestPage> {
  const { deviceId, range, page = 1, pageSize = 50 } = input;
  const since = rangeToDate(range);

  const where = {
    ...(deviceId ? { deviceId } : {}),
    measuredAt: { gte: since },
  };

  const [total, rows] = await Promise.all([
    prisma.speedtestResult.count({ where }),
    prisma.speedtestResult.findMany({
      where,
      orderBy: { measuredAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    data: rows.map(serializeSpeedtestResult),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getSpeedtestHistory(input: {
  deviceId: string;
  range: TimeRange;
  page?: number;
  pageSize?: number;
}): Promise<SpeedtestPage | null> {
  const { deviceId, range, page = 1, pageSize = 100 } = input;
  const since = rangeToDate(range);

  const deviceExists = await prisma.device.findUnique({
    where: { id: deviceId },
    select: { id: true },
  });

  if (!deviceExists) {
    return null;
  }

  const where = {
    deviceId,
    measuredAt: {
      gte: since,
    },
  };

  const [total, rows] = await Promise.all([
    prisma.speedtestResult.count({ where }),
    prisma.speedtestResult.findMany({
      where,
      orderBy: {
        measuredAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    data: rows.map(serializeSpeedtestResult),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
