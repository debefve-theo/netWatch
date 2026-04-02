import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  COOKIE_MAX_AGE,
  computeSessionToken,
  isDashboardPasswordConfigured,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!isDashboardPasswordConfigured()) {
    return NextResponse.json({ error: "No password configured" }, { status: 500 });
  }

  let password: string;
  try {
    const body = await request.json();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const dashboardPassword = process.env.DASHBOARD_PASSWORD ?? "";

  // Small fixed delay to slow brute-force attempts
  await new Promise((r) => setTimeout(r, 300));

  if (password !== dashboardPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await computeSessionToken();
  const isSecureRequest =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureRequest,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
