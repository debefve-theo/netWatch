import { jsonError, jsonOk, zodIssues } from "@/lib/http";
import { getSpeedtestHistory } from "@/lib/queries";
import { speedtestQuerySchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = speedtestQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return jsonError(400, "Invalid query string.", zodIssues(parsed.error));
  }

  try {
    const history = await getSpeedtestHistory(parsed.data);

    if (!history) {
      return jsonError(404, "Device not found.");
    }

    return jsonOk(history);
  } catch (error) {
    console.error("GET /api/speedtests failed", error);
    return jsonError(500, "Failed to load speedtest history.");
  }
}
