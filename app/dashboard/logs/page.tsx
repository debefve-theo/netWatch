"use client";

import { useState } from "react";
import { AlertTriangle, Bug, Info, RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogsData } from "@/hooks/use-logs-data";
import type { LogLevel } from "@/lib/mock-data/logs";
import { StatCard } from "@/components/dashboard/stat-card";

const levelConfig: Record<LogLevel, { label: string; class: string; icon: React.ElementType }> = {
  info:  { label: "INFO",  class: "bg-blue-500/10 text-blue-400 border-blue-500/20",   icon: Info },
  warn:  { label: "WARN",  class: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: TriangleAlert },
  error: { label: "ERROR", class: "bg-red-500/10 text-red-400 border-red-500/20",       icon: AlertTriangle },
  debug: { label: "DEBUG", class: "bg-zinc-700/60 text-zinc-400 border-zinc-600",       icon: Bug },
};

const LEVELS: (LogLevel | "all")[] = ["all", "info", "warn", "error", "debug"];

export default function LogsPage() {
  const { data: logs, isLoading, refetch } = useLogsData();
  const [filter, setFilter] = useState<LogLevel | "all">("all");

  const filtered = (logs ?? []).filter((l) => filter === "all" || l.level === filter);

  const counts = {
    info:  (logs ?? []).filter((l) => l.level === "info").length,
    warn:  (logs ?? []).filter((l) => l.level === "warn").length,
    error: (logs ?? []).filter((l) => l.level === "error").length,
    debug: (logs ?? []).filter((l) => l.level === "debug").length,
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Info" value={counts.info} icon={<Info className="h-4 w-4" />} accent="blue" loading={isLoading} />
        <StatCard title="Warnings" value={counts.warn} icon={<TriangleAlert className="h-4 w-4" />} accent="amber" loading={isLoading} />
        <StatCard title="Errors" value={counts.error} icon={<AlertTriangle className="h-4 w-4" />} accent="rose" loading={isLoading} />
        <StatCard title="Debug" value={counts.debug} icon={<Bug className="h-4 w-4" />} accent="violet" loading={isLoading} />
      </section>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 px-5 py-3.5">
          <div className="flex gap-1.5">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition",
                  filter === lvl
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {lvl === "all" ? "All" : lvl.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {/* Log entries */}
        {isLoading ? (
          <div className="p-6 text-center text-xs text-zinc-500">Loading logs…</div>
        ) : (
          <div className="divide-y divide-zinc-700/30 font-mono text-xs">
            {filtered.map((entry) => {
              const cfg = levelConfig[entry.level];
              const Icon = cfg.icon;
              return (
                <div key={entry.id} className="group flex gap-3 px-5 py-3 transition hover:bg-zinc-700/20">
                  {/* Timestamp */}
                  <span className="w-40 shrink-0 text-zinc-600">
                    {new Date(entry.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })}
                  </span>

                  {/* Level badge */}
                  <span className={cn("flex h-5 w-14 shrink-0 items-center justify-center gap-1 rounded-full border text-[10px] font-semibold", cfg.class)}>
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>

                  {/* Device */}
                  <span className="w-36 shrink-0 text-zinc-400">{entry.device}</span>

                  {/* Message */}
                  <span className="flex-1 text-zinc-300">{entry.message}</span>

                  {/* Details */}
                  {entry.details && (
                    <span className="hidden text-zinc-600 group-hover:inline">{entry.details}</span>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-zinc-500">No {filter === "all" ? "" : filter} entries</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
