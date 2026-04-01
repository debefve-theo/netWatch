"use client";

import { LineChartCard } from "@/components/dashboard/line-chart-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChartCard } from "@/components/dashboard/bar-chart-card";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { BarChart3, Clock, TrendingUp, Zap } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalyticsData();

  const perf = data?.devicePerformance ?? [];

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="P50 Download"
          value={isLoading ? "—" : "412"}
          unit="Mbps"
          icon={<Zap className="h-4 w-4" />}
          accent="blue"
          trend={{ value: +3.1 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="P95 Download"
          value={isLoading ? "—" : "821"}
          unit="Mbps"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="emerald"
          trend={{ value: +1.8 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="P99 Download"
          value={isLoading ? "—" : "962"}
          unit="Mbps"
          icon={<BarChart3 className="h-4 w-4" />}
          accent="violet"
          trend={{ value: -0.4 }}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          title="Avg Test Duration"
          value={isLoading ? "—" : "14.2"}
          unit="s"
          subtitle="per device, per test"
          icon={<Clock className="h-4 w-4" />}
          accent="amber"
          loading={isLoading}
          error={isError}
        />
      </section>

      {/* Percentile line chart */}
      <LineChartCard
        title="Download percentiles — 30 days"
        subtitle="P50 / P95 / P99 — all devices combined"
        data={data?.percentiles ?? []}
        xKey="date"
        series={[
          { key: "p50", color: "#3b82f6", label: "P50" },
          { key: "p95", color: "#8b5cf6", label: "P95" },
          { key: "p99", color: "#10b981", label: "P99" },
        ]}
        unit="Mbps"
        height={280}
        loading={isLoading}
        error={isError}
        onRefresh={refetch}
      />

      {/* Bar chart — tests per device */}
      <BarChartCard
        title="Tests per device — all time"
        subtitle="Total speedtests run per device"
        data={perf.map((d) => ({ label: d.device.replace("RPi-", ""), value: d.tests }))}
        color="#3b82f6"
        unit="tests"
        height={220}
        loading={isLoading}
        error={isError}
        onRefresh={refetch}
      />

      {/* Device performance table */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-3.5">
          <p className="text-sm font-semibold text-zinc-100">Device performance</p>
          <span className="text-xs text-zinc-500">{perf.length} devices</span>
        </div>

        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-xs">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  {["Device", "Avg Download", "Avg Upload", "Avg Ping", "Total Tests"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30">
                {perf.map((d) => (
                  <tr key={d.device} className="hover:bg-zinc-700/20">
                    <td className="px-5 py-3 font-medium text-zinc-200">{d.device}</td>
                    <td className="px-5 py-3 font-mono text-zinc-300">
                      {d.avgDown} <span className="text-zinc-500">Mbps</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-300">
                      {d.avgUp} <span className="text-zinc-500">Mbps</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-300">
                      {d.avgPing} <span className="text-zinc-500">ms</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-300">{d.tests.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
