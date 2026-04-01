import { jsonError, jsonOk, zodIssues } from "@/lib/http";
import { getOverviewStats } from "@/lib/queries";
import { statsQuerySchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = statsQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return jsonError(400, "Invalid query string.", zodIssues(parsed.error));
  }

  try {
    const stats = await getOverviewStats(parsed.data.deviceId, parsed.data.range);

    if (!stats) {
      return jsonError(404, "Device not found.");
    }

    return jsonOk({ data: stats });
  } catch (error) {
    console.error("GET /api/stats/overview failed", error);
    return jsonError(500, "Failed to load overview stats.");
  }
}
