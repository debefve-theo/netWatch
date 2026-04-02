import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { TimeRange } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a range string like "24h" / "7d" to a Date object in the past. */
export function rangeToDate(range: TimeRange): Date {
  const now = new Date();
  const map: Record<TimeRange, number> = {
    "1h": 1 * 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "3d": 3 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  const offset = map[range];
  return new Date(now.getTime() - offset);
}

export function formatMbps(value: number): string {
  return value.toFixed(1);
}

export function formatMs(value: number): string {
  return value.toFixed(1);
}

export function formatPercent(value: number): string {
  return value.toFixed(2);
}

export function formatDateTime(value: string | Date): string {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function getRangeLabel(range: TimeRange): string {
  const labels: Record<TimeRange, string> = {
    "1h": "1h",
    "6h": "6h",
    "24h": "24h",
    "3d": "3d",
    "7d": "7d",
    "30d": "30d",
  };

  return labels[range];
}

export function firstQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
