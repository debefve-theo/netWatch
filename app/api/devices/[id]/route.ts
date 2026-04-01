import { jsonError, jsonOk } from "@/lib/http";
import { getDeviceDetail } from "@/lib/queries";
import { deviceIdSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolved = await params;
  const parsedId = deviceIdSchema.safeParse(resolved.id);

  if (!parsedId.success) {
    return jsonError(400, "Invalid device id.");
  }

  try {
    const device = await getDeviceDetail(parsedId.data);

    if (!device) {
      return jsonError(404, "Device not found.");
    }

    return jsonOk({ data: device });
  } catch (error) {
    console.error(`GET /api/devices/${resolved.id} failed`, error);
    return jsonError(500, "Failed to load device.");
  }
}
