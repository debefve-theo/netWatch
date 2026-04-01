import type { OverviewStats } from "@/types";
import { formatMbps, formatMs, formatPercent } from "@/lib/utils";
import { SectionCard } from "./section-card";

export function OverviewStatsPanel({ stats }: { stats: OverviewStats }) {
  const items = [
    { label: "Tests", value: `${stats.totalTests}` },
    { label: "Avg download", value: `${formatMbps(stats.avgDownloadMbps)} Mbps` },
    { label: "Avg upload", value: `${formatMbps(stats.avgUploadMbps)} Mbps` },
    { label: "Avg ping", value: `${formatMs(stats.avgPingMs)} ms` },
    { label: "Avg jitter", value: `${formatMs(stats.avgJitterMs)} ms` },
    { label: "Min ping", value: `${formatMs(stats.minPingMs)} ms` },
    { label: "Max ping", value: `${formatMs(stats.maxPingMs)} ms` },
    { label: "Min download", value: `${formatMbps(stats.minDownloadMbps)} Mbps` },
    { label: "Max download", value: `${formatMbps(stats.maxDownloadMbps)} Mbps` },
    { label: "Min upload", value: `${formatMbps(stats.minUploadMbps)} Mbps` },
    { label: "Max upload", value: `${formatMbps(stats.maxUploadMbps)} Mbps` },
    { label: "Avg packet loss", value: `${formatPercent(stats.avgPacketLoss)} %` },
  ];

  return (
    <SectionCard
      title="Summary"
      description={`Computed over ${stats.range}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-zinc-700/60 bg-zinc-900/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{item.label}</p>
            <p className="mt-2 font-mono text-sm font-medium text-zinc-200">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
