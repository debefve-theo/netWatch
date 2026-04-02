"use client";

/**
 * Renders a UTC timestamp in the user's local browser timezone.
 * Uses suppressHydrationWarning to avoid SSR/client mismatch
 * (server renders in UTC, client updates to local time immediately).
 */

type LocalTimeProps = {
  date: string | Date;
  /** "datetime" = "2 avr. 2026, 14:32" (default)
   *  "short"    = "2 avr., 14:32"
   *  "time"     = "14:32:05"
   *  "date"     = "2 avr. 2026"
   */
  format?: "datetime" | "short" | "time" | "date";
  className?: string;
};

function fmt(date: string | Date, format: LocalTimeProps["format"]): string {
  const d = new Date(date);
  switch (format) {
    case "short":
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "time":
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    case "date":
      return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    default:
      return d.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }
}

export function LocalTime({ date, format = "datetime", className }: LocalTimeProps) {
  return (
    <time
      dateTime={new Date(date).toISOString()}
      suppressHydrationWarning
      className={className}
    >
      {fmt(date, format)}
    </time>
  );
}
