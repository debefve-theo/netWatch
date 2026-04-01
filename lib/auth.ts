/**
 * API key authentication helper for ingest routes.
 */
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { verifyApiKey } from "./crypto";
import { jsonError } from "./http";

export type AuthenticatedDevice = {
  id: string;
  name: string;
  enabled: boolean;
};

export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.slice(7).trim();
  if (!rawKey || rawKey.length < 16) {
    return null;
  }

  return rawKey;
}

export async function authenticateDeviceRequest(
  request: NextRequest,
  deviceId: string,
): Promise<
  | { success: true; device: AuthenticatedDevice }
  | { success: false; response: Response }
> {
  const rawKey = extractBearerToken(request);

  if (!rawKey) {
    return {
      success: false,
      response: jsonError(401, "Missing or invalid Authorization bearer token."),
    };
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    select: { id: true, name: true, apiKeyHash: true, enabled: true },
  });

  if (!device || !device.enabled) {
    return {
      success: false,
      response: jsonError(401, "Invalid API credentials."),
    };
  }

  const valid = await verifyApiKey(rawKey, device.apiKeyHash);

  if (!valid) {
    return {
      success: false,
      response: jsonError(401, "Invalid API credentials."),
    };
  }

  return {
    success: true,
    device: {
      id: device.id,
      name: device.name,
      enabled: device.enabled,
    }
  };
}
