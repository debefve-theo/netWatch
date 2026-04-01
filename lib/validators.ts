/**
 * Zod schemas for all API inputs.
 */
import { z } from "zod";

export const timeRangeSchema = z.enum(["1h", "6h", "24h", "7d", "30d"]);

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().max(max).optional(),
  );

/** Payload sent by the Raspberry Pi to POST /api/ingest/speedtest */
export const ingestSpeedtestSchema = z
  .object({
    deviceId: z.string().cuid(),
    measuredAt: z.string().datetime({ offset: true }),
    pingMs: z.number().nonnegative().max(100_000),
    jitterMs: z.number().nonnegative().max(100_000),
    downloadMbps: z.number().nonnegative().max(100_000),
    uploadMbps: z.number().nonnegative().max(100_000),
    packetLoss: z.preprocess(
      (value) => (value === null || value === undefined ? 0 : value),
      z.number().min(0).max(100),
    ),
    isp: optionalTrimmedString(256),
    externalIp: optionalTrimmedString(64),
    serverId: optionalTrimmedString(64),
    serverName: optionalTrimmedString(256),
    serverLocation: optionalTrimmedString(256),
    serverCountry: optionalTrimmedString(128),
    resultUrl: z.preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed.length === 0 ? undefined : trimmed;
      },
      z.string().url().max(512).optional(),
    ),
  })
  .strict();

export type IngestSpeedtestInput = z.infer<typeof ingestSpeedtestSchema>;

export const deviceIdSchema = z.string().cuid();

/** Query params for GET /api/speedtests */
export const speedtestQuerySchema = z.object({
  deviceId: deviceIdSchema,
  range: timeRangeSchema.default("24h"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(500).default(100),
});

/** Query params for GET /api/stats/overview */
export const statsQuerySchema = z.object({
  deviceId: deviceIdSchema,
  range: timeRangeSchema.default("24h"),
});

export const dashboardSearchSchema = z.object({
  deviceId: deviceIdSchema.optional(),
  range: timeRangeSchema.default("24h"),
});

export const deviceHistorySearchSchema = z.object({
  range: timeRangeSchema.default("24h"),
  page: z.coerce.number().int().positive().default(1),
});
