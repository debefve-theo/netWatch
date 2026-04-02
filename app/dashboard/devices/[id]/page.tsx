import { notFound } from "next/navigation";
import { Activity, ArrowDownToLine, ArrowUpToLine, Clock, ExternalLink, Gauge, Globe } from "lucide-react";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { NetworkQualityBadge } from "@/components/dashboard/network-quality-badge";
import { HistoryTable } from "@/components/dashboard/history-table";
import { RangeSelector } from "@/components/dashboard/range-selector";
import { SpeedChart } from "@/components/dashboard/speed-chart";
import { LatencyChart } from "@/components/dashboard/latency-chart";
import { PacketLossChart } from "@/components/dashboard/packet-loss-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getOverviewStats, getSpeedtestHistory } from "@/lib/queries";
import { getNetworkQuality } from "@/lib/network-quality";
import { firstQueryValue, formatMbps, formatMs, formatPercent } from "@/lib/utils";
import { LocalTime } from "@/components/ui/local-time";
import { deviceHistorySearchSchema, deviceIdSchema } from "@/lib/validators";
import { formatDistanceToNowStrict } from "date-fns";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DeviceDetailPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const parsedDeviceId = deviceIdSchema.safeParse(resolvedParams.id);
  if (!parsedDeviceId.success) notFound();

  const resolvedSearch = (await searchParams) ?? {};
  const parsedSearch = deviceHistorySearchSchema.safeParse({
    range: firstQueryValue(resolvedSearch.range),
    page: firstQueryValue(resolvedSearch.page),
  });

  const range = parsedSearch.success ? parsedSearch.data.range : "24h";
  const page = parsedSearch.success ? parsedSearch.data.page : 1;
  const deviceId = parsedDeviceId.data;

  const [stats, history] = await Promise.all([
    getOverviewStats(deviceId, range),
    getSpeedtestHistory({ deviceId, range, page, pageSize: 30 }),
  ]);

  if (!stats || !history) notFound();

  const latest = stats.latestResult;
  const chartData = [...history.data].reverse();
  const quality = getNetworkQuality(latest);
  const hasData = stats.totalTests > 0;

  return (
    <div className="space-y-5">
      {/* Device header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100">{stats.device.name}</h1>
            <DeviceStatusBadge status={stats.device.status} />
            <NetworkQualityBadge quality={quality} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            {stats.device.locationLabel && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {stats.device.locationLabel}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last seen{" "}
              {stats.device.lastSeenAt
                ? formatDistanceToNowStrict(new Date(stats.device.lastSeenAt), { addSuffix: true })
                : "never"}
            </span>
            <span>{stats.device.resultsCount.toLocaleString()} total tests</span>
          </div>
        </div>

        <RangeSelector currentRange={range} />
      </div>

      {/* KPI cards */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Download"
          value={latest ? formatMbps(latest.downloadMbps) : "—"}
          unit="Mbps"
          subtitle={hasData ? `avg ${formatMbps(stats.avgDownloadMbps)} · max ${formatMbps(stats.maxDownloadMbps)}` : "No data in range"}
          icon={<ArrowDownToLine className="h-4 w-4" />}
          accent="blue"
          trend={hasData ? { value: 0 } : undefined}
        />
        <StatCard
          title="Upload"
          value={latest ? formatMbps(latest.uploadMbps) : "—"}
          unit="Mbps"
          subtitle={hasData ? `avg ${formatMbps(stats.avgUploadMbps)} · max ${formatMbps(stats.maxUploadMbps)}` : "No data in range"}
          icon={<ArrowUpToLine className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Ping"
          value={latest ? formatMs(latest.pingMs) : "—"}
          unit="ms"
          subtitle={hasData ? `avg ${formatMs(stats.avgPingMs)} · min ${formatMs(stats.minPingMs)}` : "No data in range"}
          icon={<Gauge className="h-4 w-4" />}
          accent="violet"
        />
        <StatCard
          title="Jitter / Loss"
          value={latest ? formatMs(latest.jitterMs) : "—"}
          unit="ms"
          subtitle={latest ? `packet loss ${formatPercent(latest.packetLoss)}%` : "No data"}
          icon={<Activity className="h-4 w-4" />}
          accent="amber"
        />
      </section>

      {/* Charts */}
      {chartData.length === 0 ? (
        <EmptyState
          compact
          title="No data for this range"
          description="No speedtest results were recorded in the selected window. Try a wider range."
        />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-2">
            <SpeedChart data={chartData} metric="downloadMbps" title="Download" color="#3b82f6" />
            <SpeedChart data={chartData} metric="uploadMbps" title="Upload" color="#10b981" />
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <LatencyChart data={chartData} />
            <PacketLossChart data={chartData} />
          </section>
        </>
      )}

      {/* Latest measurement details */}
      {latest && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Latest measurement</p>
              <LocalTime date={latest.measuredAt} className="mt-0.5 text-xs text-zinc-500" />
            </div>
            {latest.resultUrl && (
              <a
                href={latest.resultUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
              >
                <ExternalLink className="h-3 w-3" />
                Speedtest result
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "ISP", value: latest.isp ?? "Unknown" },
              { label: "External IP", value: latest.externalIp ?? "Unknown", mono: true },
              { label: "Server", value: latest.serverName ? `${latest.serverName}${latest.serverLocation ? `, ${latest.serverLocation}` : ""}` : "Unknown" },
              { label: "Country", value: latest.serverCountry ?? "Unknown" },
              { label: "Packet loss", value: `${formatPercent(latest.packetLoss)}%` },
            ].map(({ label, value, mono }) => (
              <div key={label} className="rounded-lg border border-zinc-700/60 bg-zinc-900/50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{label}</p>
                <p className={`mt-1.5 text-sm text-zinc-200 ${mono ? "font-mono" : ""}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History table */}
      <HistoryTable
        title="History"
        description={`${history.total} result(s) in the ${range} window — page ${history.page} / ${history.totalPages}`}
        results={history.data}
        emptyDescription="No measurements found for the selected range."
        pagination={
          history.totalPages > 1
            ? {
                currentPage: history.page,
                totalPages: history.totalPages,
                makeHref: (p) => `/dashboard/devices/${deviceId}?range=${range}&page=${p}`,
              }
            : undefined
        }
      />
    </div>
  );
}
