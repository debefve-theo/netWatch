import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.device.count();

    return Response.json(
      {
        ok: true,
        status: "healthy",
        checkedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/health failed", error);

    return Response.json(
      {
        ok: false,
        status: "unhealthy",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
