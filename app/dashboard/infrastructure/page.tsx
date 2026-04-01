"use client";

import { Layers, Server, Wifi } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChartCard } from "@/components/dashboard/line-chart-card";
import { BarChartCard } from "@/components/dashboard/bar-chart-card";
import { useInfrastructureData } from "@/hooks/use-infrastructure-data";

export default function InfrastructurePage() {
  const { data, isLoading, isError, refetch } = useInfrastructureData();

  const isps = data?.isps ?? [];
  const servers = data?.servers ?? [];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="ISPs monitored" value={isps.length || 4} icon={<Wifi className="h-4 w-4" />} accent="blue" loading={isLoading} />
        <StatCard title="Test servers" value={servers.length || 4} icon={<Server className="h-4 w-4" />} accent="emerald" loading={isLoading} />
        <StatCard title="Avg ISP uptime" value={isLoading ? "—" : "96.3"} unit="%" icon={<Layers className="h-4 w-4" />} accent="violet" loading={isLoading} />
        <StatCard title="Total bandwidth" value={isLoading ? "—" : "8.4"} unit="TB/mo" icon={<Layers className="h-4 w-4" />} accent="amber" loading={isLoading} />
      </section>

      {/* Bandwidth area chart */}
      <LineChartCard
        title="Bandwidth over 24h"
        subtitle="Ingress and egress across all devices"
        data={data?.bandwidth ?? []}
        xKey="time"
        series={[
          { key: "ingress", color: "#3b82f6", label: "Ingress" },
          { key: "egress", color: "#10b981", label: "Egress" },
        ]}
        unit="Mbps"
        height={260}
        loading={isLoading}
        error={isError}
        onRefresh={refetch}
      />

      {/* ISP table + avg download bar */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-zinc-700 bg-zinc-800">
          <div className="border-b border-zinc-700 px-5 py-3.5">
            <p className="text-sm font-semibold text-zinc-100">ISP overview</p>
          </div>
          {isLoading ? (
            <div className="p-6 text-center text-xs text-zinc-500">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-xs">
                <thead>
                  <tr className="border-b border-zinc-700/50">
                    {["ISP", "Devices", "Avg Down", "Avg Ping", "Uptime"].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/30">
                  {isps.map((isp) => (
                    <tr key={isp.name} className="hover:bg-zinc-700/20">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: isp.color }} />
                          <span className="font-medium text-zinc-200">{isp.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-zinc-300">{isp.devices}</td>
                      <td className="px-5 py-3 font-mono text-zinc-300">{isp.avgDownload} <span className="text-zinc-500">Mbps</span></td>
                      <td className="px-5 py-3 font-mono text-zinc-300">{isp.avgPing} <span className="text-zinc-500">ms</span></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-zinc-700">
                            <div
                              className={isp.uptime > 98 ? "h-full rounded-full bg-emerald-500" : isp.uptime > 90 ? "h-full rounded-full bg-amber-500" : "h-full rounded-full bg-red-500"}
                              style={{ width: `${isp.uptime}%` }}
                            />
                          </div>
                          <span className="text-zinc-400">{isp.uptime}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <BarChartCard
          title="Avg download by ISP"
          subtitle="Average measured throughput"
          data={isps.map((i) => ({ label: i.name, value: i.avgDownload }))}
          color="#3b82f6"
          unit="Mbps"
          height={240}
          loading={isLoading}
          error={isError}
          onRefresh={refetch}
        />
      </section>

      {/* Test servers */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800">
        <div className="border-b border-zinc-700 px-5 py-3.5">
          <p className="text-sm font-semibold text-zinc-100">Test servers</p>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-xs text-zinc-500">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  {["Server", "Location", "Provider", "Tests run", "Avg ping"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30">
                {servers.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-700/20">
                    <td className="px-5 py-3 font-medium text-zinc-200">{s.name}</td>
                    <td className="px-5 py-3 text-zinc-400">{s.location}</td>
                    <td className="px-5 py-3 text-zinc-400">{s.provider}</td>
                    <td className="px-5 py-3 font-mono text-zinc-300">{s.tests.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-zinc-300">{s.avgPing} <span className="text-zinc-500">ms</span></td>
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
