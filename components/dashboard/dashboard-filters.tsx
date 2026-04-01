"use client";

import { startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DeviceSummary, TimeRange } from "@/types";
import { cn } from "@/lib/utils";

const ranges: TimeRange[] = ["24h", "7d", "30d"];

type DashboardFiltersProps = {
  devices: DeviceSummary[];
  currentDeviceId: string;
  currentRange: TimeRange;
  switchToOverviewOnDeviceChange?: boolean;
};

export function DashboardFilters({
  devices,
  currentDeviceId,
  currentRange,
  switchToOverviewOnDeviceChange = false,
}: DashboardFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSearch(next: Record<string, string | null>, nextPathname = pathname) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.replace(`${nextPathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3 lg:items-end">
      <div className="flex flex-wrap gap-2">
        {ranges.map((range) => (
          <button
            key={range}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm transition",
              currentRange === range
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-100",
            )}
            onClick={() => updateSearch({ range, page: null })}
            type="button"
          >
            {range}
          </button>
        ))}
      </div>

      <select
        className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-blue-500/30"
        onChange={(event) =>
          updateSearch(
            {
              deviceId: event.target.value,
              page: null,
            },
            switchToOverviewOnDeviceChange ? "/dashboard" : pathname,
          )
        }
        value={currentDeviceId}
      >
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
    </div>
  );
}
