import { notFound } from "next/navigation";
import { Activity, ArrowDownToLine, ArrowUpToLine, Gauge } from "lucide-react";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { HistoryTable } from "@/components/dashboard/history-table";
import { LatencyChart } from "@/components/dashboard/latency-chart";
import { NetworkQualityBadge } from "@/components/dashboard/network-quality-badge";
import { OverviewStatsPanel } from "@/components/dashboard/overview-stats";
import { PacketLossChart } from "@/components/dashboard/packet-loss-chart";
import { SectionCard } from "@/components/dashboard/section-card";
import { SpeedChart } from "@/components/dashboard/speed-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getOverviewStats, getSpeedtestHistory, listDevices } from "@/lib/queries";
import { getNetworkQuality } from "@/lib/network-quality";
import { firstQueryValue, formatDateTime, formatMbps, formatMs, formatPercent } from "@/lib/utils";
import { deviceHistorySearchSchema, deviceIdSchema } from "@/lib/validators";
import { formatDistanceToNowStrict } from "date-fns";

export const dynamic = "force-dynamic";

type DeviceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DeviceDetailPage({ params, searchParams }: DeviceDetailPageProps) {
  const resolvedParams = await params;
  const parsedDeviceId = deviceIdSchema.safeParse(resolvedParams.id);

  if (!parsedDeviceId.success) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const parsedSearch = deviceHistorySearchSchema.safeParse({
    range: firstQueryValue(resolvedSearchParams.range),
    page: firstQueryValue(resolvedSearchParams.page),
  });

  const range = parsedSearch.success ? parsedSearch.data.range : "24h";
  const page = parsedSearch.success ? parsedSearch.data.page : 1;

  const [devices, stats, history] = await Promise.all([
    listDevices(),
    getOverviewStats(parsedDeviceId.data, range),
    getSpeedtestHistory({
      deviceId: parsedDeviceId.data,
      range,
      page,
      pageSize: 25,
    }),
  ]);

  if (!stats || !history) {
    notFound();
  }

  const latest = stats.latestResult;
  const chartData = [...history.data].reverse();
  const quality = getNetworkQuality(latest);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-700 bg-zinc-800 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Device detail</p>
              <DeviceStatusBadge status={stats.device.status} />
              <NetworkQualityBadge quality={quality} />
            </div>
            <h1 className="text-3xl font-semibold text-white">{stats.device.name}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
              <span>{stats.device.locationLabel ?? "No location set"}</span>
              <span>
                Last contact{" "}
                {stats.device.lastSeenAt
                  ? formatDistanceToNowStrict(new Date(stats.device.lastSeenAt), {
                      addSuffix: true,
                    })
                  : "never"}
              </span>
              <span>{stats.device.resultsCount} total tests</span>
            </div>
          </div>
          <DashboardFilters
            devices={devices}
            currentDeviceId={stats.device.id}
            currentRange={range}
            switchToOverviewOnDeviceChange
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Download"
          value={latest ? formatMbps(latest.downloadMbps) : "0.0"}
          unit="Mbps"
          subtitle={stats.totalTests > 0 ? `Avg ${formatMbps(stats.avgDownloadMbps)} · Peak ${formatMbps(stats.maxDownloadMbps)} Mbps` : "No data"}
          accent="blue"
          icon={<ArrowDownToLine className="h-4 w-4" />}
        />
        <StatCard
          title="Upload"
          value={latest ? formatMbps(latest.uploadMbps) : "0.0"}
          unit="Mbps"
          subtitle={stats.totalTests > 0 ? `Avg ${formatMbps(stats.avgUploadMbps)} · Peak ${formatMbps(stats.maxUploadMbps)} Mbps` : "No data"}
          accent="emerald"
          icon={<ArrowUpToLine className="h-4 w-4" />}
        />
        <StatCard
          title="Ping"
          value={latest ? formatMs(latest.pingMs) : "0.0"}
          unit="ms"
          subtitle={stats.totalTests > 0 ? `Avg ${formatMs(stats.avgPingMs)} · Min ${formatMs(stats.minPingMs)} ms` : "No data"}
          accent="violet"
          icon={<Gauge className="h-4 w-4" />}
        />
        <StatCard
          title="Jitter"
          value={latest ? formatMs(latest.jitterMs) : "0.0"}
          unit="ms"
          subtitle={stats.totalTests > 0 ? `Avg ${formatMs(stats.avgJitterMs)} ms` : "No data"}
          accent="amber"
          icon={<Activity className="h-4 w-4" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Latest measurement"
          description={latest ? formatDateTime(latest.measuredAt) : "No measurement available yet."}
        >
          {latest ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">ISP</p>
                <p className="mt-2 text-sm text-zinc-200">{latest.isp ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">External IP</p>
                <p className="mt-2 font-mono text-sm text-zinc-200">{latest.externalIp ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Server</p>
                <p className="mt-2 text-sm text-zinc-200">
                  {latest.serverName ?? "Unknown"}
                  {latest.serverLocation ? `, ${latest.serverLocation}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Country</p>
                <p className="mt-2 text-sm text-zinc-200">{latest.serverCountry ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Packet loss</p>
                <p className="mt-2 text-sm text-zinc-200">{formatPercent(latest.packetLoss)} %</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No measurements stored for this device yet.</p>
          )}
        </SectionCard>
        <OverviewStatsPanel stats={stats} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SpeedChart data={chartData} metric="downloadMbps" title="Download over time" color="#3b82f6" />
        <SpeedChart data={chartData} metric="uploadMbps" title="Upload over time" color="#10b981" />
        <LatencyChart data={chartData} />
        <PacketLossChart data={chartData} />
      </section>

      <HistoryTable
        title="Stored history"
        description={`Page ${history.page} of ${history.totalPages} in the ${range} window.`}
        results={history.data}
        emptyDescription="No measurements found for the selected range."
        pagination={{
          currentPage: history.page,
          totalPages: history.totalPages,
          makeHref: (targetPage) =>
            `/dashboard/devices/${stats.device.id}?range=${range}&page=${targetPage}`,
        }}
      />
    </div>
  );
}
