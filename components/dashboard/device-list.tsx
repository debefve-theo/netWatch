import Link from "next/link";
import { HardDrive } from "lucide-react";
import type { DeviceSummary } from "@/types";
import { DeviceStatusBadge } from "./device-status-badge";

export function DeviceList({ devices }: { devices: DeviceSummary[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {devices.map((device) => (
        <article
          key={device.id}
          className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 transition hover:border-zinc-600"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-700/60">
                <HardDrive className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">{device.name}</h3>
                <p className="text-xs text-zinc-500">{device.locationLabel ?? "No location set"}</p>
              </div>
            </div>
            <DeviceStatusBadge status={device.status} />
          </div>

          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Results stored</p>
              <p className="mt-1.5 font-mono text-zinc-300">{device.resultsCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">Last measurement</p>
              <p className="mt-1.5 text-zinc-300">
                {device.latestResultAt ? new Date(device.latestResultAt).toLocaleString() : "Never"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300"
              href={`/dashboard?deviceId=${device.id}&range=24h`}
            >
              Overview
            </Link>
            <Link
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
              href={`/dashboard/devices/${device.id}`}
            >
              Device detail
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
