import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { authenticateDeviceRequest } from "@/lib/auth";
import { jsonError, jsonOk, parseLimitedJson, zodIssues } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeSpeedtestResult } from "@/lib/serializers";
import { ingestSpeedtestSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payloadResult = await parseLimitedJson<unknown>(request);

  if (!payloadResult.success) {
    return payloadResult.response;
  }

  const parsed = ingestSpeedtestSchema.safeParse(payloadResult.data);

  if (!parsed.success) {
    return jsonError(400, "Payload validation failed.", zodIssues(parsed.error));
  }

  const auth = await authenticateDeviceRequest(request, parsed.data.deviceId);

  if (!auth.success) {
    return auth.response;
  }

  if (parsed.data.deviceId !== auth.device.id) {
    return jsonError(403, "Payload deviceId does not match the authenticated device.");
  }

  const measuredAt = new Date(parsed.data.measuredAt);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.speedtestResult.create({
        data: {
          deviceId: auth.device.id,
          measuredAt,
          pingMs: parsed.data.pingMs,
          jitterMs: parsed.data.jitterMs,
          downloadMbps: parsed.data.downloadMbps,
          uploadMbps: parsed.data.uploadMbps,
          packetLoss: parsed.data.packetLoss,
          isp: parsed.data.isp,
          externalIp: parsed.data.externalIp,
          serverId: parsed.data.serverId,
          serverName: parsed.data.serverName,
          serverLocation: parsed.data.serverLocation,
          serverCountry: parsed.data.serverCountry,
          resultUrl: parsed.data.resultUrl,
        },
      });

      await tx.device.update({
        where: {
          id: auth.device.id,
        },
        data: {
          lastSeenAt: new Date(),
        },
      });

      return created;
    });

    return jsonOk(
      {
        status: "created" as const,
        deviceId: auth.device.id,
        result: serializeSpeedtestResult(result),
      },
      201,
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await prisma.device.update({
        where: { id: auth.device.id },
        data: { lastSeenAt: new Date() },
      });

      const existing = await prisma.speedtestResult.findUnique({
        where: {
          deviceId_measuredAt: {
            deviceId: auth.device.id,
            measuredAt,
          },
        },
      });

      return jsonOk({
        status: "duplicate" as const,
        deviceId: auth.device.id,
        result: existing ? serializeSpeedtestResult(existing) : null,
      });
    }

    console.error("POST /api/ingest/speedtest failed", error);
    return jsonError(500, "Failed to store speedtest result.");
  }
}
