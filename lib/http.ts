import { ZodError } from "zod";

export const MAX_INGEST_BODY_BYTES = 10 * 1024;

export function jsonError(status: number, message: string, details?: unknown) {
  return Response.json(
    {
      ok: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function jsonOk<T>(payload: T, status = 200) {
  return Response.json(
    {
      ok: true,
      ...payload,
    },
    { status },
  );
}

export function zodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export async function parseLimitedJson<T>(
  request: Request,
  maxBytes = MAX_INGEST_BODY_BYTES,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : null;

  if (contentLength !== null && Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      success: false,
      response: jsonError(413, `Payload too large. Limit is ${maxBytes} bytes.`),
    };
  }

  const rawText = await request.text();

  if (rawText.length > maxBytes) {
    return {
      success: false,
      response: jsonError(413, `Payload too large. Limit is ${maxBytes} bytes.`),
    };
  }

  try {
    return {
      success: true,
      data: JSON.parse(rawText) as T,
    };
  } catch {
    return {
      success: false,
      response: jsonError(400, "Malformed JSON body."),
    };
  }
}
