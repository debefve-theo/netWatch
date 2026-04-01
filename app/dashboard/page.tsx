"use client";

import { Activity, ArrowDownToLine, ArrowUpToLine, Gauge, HardDrive, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChartCard } from "@/components/dashboard/line-chart-card";
import { BarChartCard } from "@/components/dashboard/bar-chart-card";
import { DonutChartCard } from "@/components/dashboard/donut-chart-card";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { GaugeCard } from "@/components/dashboard/gauge-card";
import { useOverviewData } from "@/hooks/use-overview-data";

export default function OverviewPage() {
  const { data, isLoading, isError, refetch } = useOverviewData();

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Avg Download"
          value={isLoading ? "—" : kpis?.avgDownload.toFixed(1) ?? "—"}
          unit="Mbps"
          icon={<ArrowDownToLine className="h-4 w-4" />}
          accent="blue"
          trend={isLoading ? undefined : { value: +4.2 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="Avg Upload"
          value={isLoading ? "—" : kpis?.avgUpload.toFixed(1) ?? "—"}
          unit="Mbps"
          icon={<ArrowUpToLine className="h-4 w-4" />}
          accent="emerald"
          trend={isLoading ? undefined : { value: +2.1 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="Avg Latency"
          value={isLoading ? "—" : kpis?.avgPing.toFixed(1) ?? "—"}
          unit="ms"
          subtitle={isLoading ? undefined : `Packet loss ${kpis?.packetLoss}%`}
          icon={<Gauge className="h-4 w-4" />}
          accent="violet"
          trend={isLoading ? undefined : { value: -1.3 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="Devices Online"
          value={isLoading ? "—" : `${kpis?.devicesOnline}/${kpis?.devicesTotal}` ?? "—"}
          subtitle={isLoading ? undefined : `${kpis?.totalTests.toLocaleString()} total tests`}
          icon={<HardDrive className="h-4 w-4" />}
          accent="amber"
          loading={isLoading}
          error={isError}
        />
      </section>

      {/* Speed timeline + Latency timeline */}
      <section className="grid gap-4 xl:grid-cols-2">
        <LineChartCard
          title="Speed over time"
          subtitle="Last 24 hours — Download & Upload"
          data={data?.speedTimeline ?? []}
          xKey="time"
          series={[
            { key: "download", color: "#3b82f6", label: "Download" },
            { key: "upload", color: "#10b981", label: "Upload" },
          ]}
          unit="Mbps"
          height={240}
          loading={isLoading}
          error={isError}
          onRefresh={refetch}
        />
        <LineChartCard
          title="Latency over time"
          subtitle="Last 24 hours — Ping & Jitter"
          data={data?.latencyTimeline ?? []}
          xKey="time"
          series={[
            { key: "ping", color: "#8b5cf6", label: "Ping" },
            { key: "jitter", color: "#f59e0b", label: "Jitter" },
          ]}
          unit="ms"
          height={240}
          loading={isLoading}
          error={isError}
          onRefresh={refetch}
        />
      </section>

      {/* Bar chart + Donut + Gauges */}
      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <BarChartCard
          title="Tests per hour"
          subtitle="Today — number of speedtests per 2h window"
          data={data?.hourlyTests ?? []}
          color="#3b82f6"
          unit="tests"
          height={220}
          loading={isLoading}
          error={isError}
          onRefresh={refetch}
        />

        <DonutChartCard
          title="ISP distribution"
          subtitle="By device count"
          data={data?.ispDonut ?? []}
          total={data ? Object.values(data.ispDonut).reduce((a, b) => a + b.value, 0) : undefined}
          totalLabel="ISPs"
          height={200}
          loading={isLoading}
        />
      </section>

      {/* Geo table + Gauges */}
      <section className="grid gap-4 xl:grid-cols-[1fr_auto]">
        {/* Country breakdown */}
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
          <p className="mb-4 text-sm font-semibold text-zinc-100">Coverage by country</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-xs">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  {["Country", "Tests", "Avg Down", "Share"].map((h) => (
                    <th key={h} className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30">
                {(data?.countryData ?? []).map((row) => (
                  <tr key={row.country} className="hover:bg-zinc-700/20">
                    <td className="py-3 pr-4">
                      <span className="mr-2">{row.flag}</span>
                      <span className="text-zinc-200">{row.country}</span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-zinc-300">{row.tests.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-mono text-zinc-300">{row.avgDownload} <span className="text-zinc-500">Mbps</span></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-700">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${row.share}%` }} />
                        </div>
                        <span className="text-zinc-400">{row.share}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance gauges */}
        {data && (
          <div className="flex flex-col justify-center gap-6 rounded-xl border border-zinc-700 bg-zinc-800 p-6 xl:flex-row xl:items-center">
            <GaugeCard
              title="Download"
              value={Math.min((kpis!.avgDownload / 1000) * 100, 100)}
              displayValue={kpis!.avgDownload.toFixed(0)}
              unit="Mbps"
              subtitle="of 1 Gbps"
              color="#3b82f6"
              size={110}
            />
            <GaugeCard
              title="Latency"
              value={Math.max(0, 100 - (kpis!.avgPing / 100) * 100)}
              displayValue={kpis!.avgPing.toFixed(1)}
              unit="ms"
              subtitle="quality index"
              color="#8b5cf6"
              size={110}
            />
            <GaugeCard
              title="Uptime"
              value={(kpis!.devicesOnline / kpis!.devicesTotal) * 100}
              displayValue={`${Math.round((kpis!.devicesOnline / kpis!.devicesTotal) * 100)}`}
              unit="%"
              subtitle={`${kpis!.devicesOnline} / ${kpis!.devicesTotal} devices`}
              color="#10b981"
              size={110}
            />
          </div>
        )}
      </section>

      {/* Activity table */}
      {data && <ActivityTable data={data.recentActivity} />}
    </div>
  );
}
