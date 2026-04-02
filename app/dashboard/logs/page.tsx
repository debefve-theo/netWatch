import Link from "next/link";
import { ArrowDownToLine, ArrowUpToLine, ExternalLink, Gauge } from "lucide-react";
import { getGlobalHistory, listDevices } from "@/lib/queries";
import { firstQueryValue, formatMbps, formatMs, formatPercent } from "@/lib/utils";
import { dashboardSearchSchema } from "@/lib/validators";
import { RangeSelector } from "@/components/dashboard/range-selector";
import { EmptyState } from "@/components/ui/empty-state";
import { LocalTime } from "@/components/ui/local-time";
import type { TimeRange } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LogsPage({ searchParams }: Props) {
  const resolvedSearch = (await searchParams) ?? {};
  const parsed = dashboardSearchSchema.safeParse({
    deviceId: firstQueryValue(resolvedSearch.deviceId),
    range: firstQueryValue(resolvedSearch.range),
  });

  const range: TimeRange = parsed.success ? parsed.data.range : "24h";
  const selectedDeviceId = parsed.success ? parsed.data.deviceId : undefined;
  const page = Math.max(1, Number(firstQueryValue(resolvedSearch.page) ?? "1"));

  const [devices, history] = await Promise.all([
    listDevices(),
    getGlobalHistory({ deviceId: selectedDeviceId, range, page, pageSize: 50 }),
  ]);

  const deviceMap = Object.fromEntries(devices.map((d) => [d.id, d.name]));

  function makeHref(params: Record<string, string | undefined>) {
    const base: Record<string, string> = { range };
    if (selectedDeviceId) base.deviceId = selectedDeviceId;
    const merged = { ...base, ...params };
    const qs = new URLSearchParams(
      Object.entries(merged).filter(([, v]) => v !== undefined) as [string, string][],
    ).toString();
    return `/dashboard/logs?${qs}`;
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Device filter */}
          <div className="flex gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1">
            <Link
              href={makeHref({ deviceId: undefined, page: "1" })}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                !selectedDeviceId ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All devices
            </Link>
            {devices.map((d) => (
              <Link
                key={d.id}
                href={makeHref({ deviceId: d.id, page: "1" })}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  selectedDeviceId === d.id
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>

        <RangeSelector currentRange={range} />
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Results in range",
            value: history.total.toLocaleString(),
            icon: <ArrowDownToLine className="h-3.5 w-3.5" />,
          },
          {
            label: "Devices with data",
            value: selectedDeviceId ? "1" : devices.filter((d) => d.resultsCount > 0).length.toString(),
            icon: <Gauge className="h-3.5 w-3.5" />,
          },
          {
            label: "Page",
            value: `${history.page} / ${history.totalPages}`,
            icon: <ArrowUpToLine className="h-3.5 w-3.5" />,
          },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-700/60 text-zinc-400">
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-zinc-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Results table */}
      {history.data.length === 0 ? (
        <EmptyState
          compact
          title="No results in this range"
          description="No speedtest data was recorded in the selected window. Try extending the range."
        />
      ) : (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-xs">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  {["Time", "Device", "↓ Download", "↑ Upload", "Ping", "Jitter", "Loss", "ISP", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500 first:pl-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30">
                {history.data.map((row) => (
                  <tr key={row.id} className="group transition hover:bg-zinc-700/20">
                    <td className="pl-5 pr-4 py-3 font-mono text-zinc-500">
                      <LocalTime date={row.measuredAt} format="short" />
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {deviceMap[row.deviceId] ?? row.deviceId}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-200">
                      {formatMbps(row.downloadMbps)}
                      <span className="text-zinc-500"> Mbps</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-200">
                      {formatMbps(row.uploadMbps)}
                      <span className="text-zinc-500"> Mbps</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-200">
                      {formatMs(row.pingMs)}
                      <span className="text-zinc-500"> ms</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {formatMs(row.jitterMs)}
                      <span className="text-zinc-500"> ms</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {formatPercent(row.packetLoss)}
                      <span className="text-zinc-500">%</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{row.isp ?? "—"}</td>
                    <td className="px-4 py-3">
                      {row.resultUrl ? (
                        <a
                          href={row.resultUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 opacity-0 transition hover:text-blue-400 group-hover:opacity-100"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {history.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-700/50 px-5 py-3">
              <span className="text-xs text-zinc-500">
                {history.total} results · page {history.page} of {history.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={makeHref({ page: String(Math.max(1, page - 1)) })}
                  aria-disabled={page <= 1}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                >
                  Previous
                </Link>
                <Link
                  href={makeHref({ page: String(Math.min(history.totalPages, page + 1)) })}
                  aria-disabled={page >= history.totalPages}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
