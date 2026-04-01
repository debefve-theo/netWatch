import { jsonError, jsonOk } from "@/lib/http";
import { listDevices } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const devices = await listDevices();
    return jsonOk({ data: devices });
  } catch (error) {
    console.error("GET /api/devices failed", error);
    return jsonError(500, "Failed to load devices.");
  }
}
