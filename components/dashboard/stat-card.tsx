import type { ReactNode } from "react";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = { value: number; label?: string };

type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: Trend;
  accent?: "blue" | "emerald" | "amber" | "violet" | "rose";
  loading?: boolean;
  error?: boolean;
};

const accentMap = {
  blue:    { icon: "bg-blue-500/10 text-blue-400 border-blue-500/20",    bar: "bg-blue-500" },
  emerald: { icon: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500" },
  amber:   { icon: "bg-amber-500/10 text-amber-400 border-amber-500/20",  bar: "bg-amber-500" },
  violet:  { icon: "bg-violet-500/10 text-violet-400 border-violet-500/20", bar: "bg-violet-500" },
  rose:    { icon: "bg-rose-500/10 text-rose-400 border-rose-500/20",    bar: "bg-rose-500" },
};

export function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  accent = "blue",
  loading = false,
  error = false,
}: StatCardProps) {
  const colors = accentMap[accent];

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-700" />
            <div className="h-8 w-28 animate-pulse rounded bg-zinc-700" />
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-700" />
          </div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-700" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-zinc-800 p-5">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">{title}</p>
          <p className="mt-1 text-sm text-red-400">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 transition hover:border-zinc-600">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold leading-none text-zinc-100">{value}</span>
            {unit && <span className="text-xs text-zinc-500">{unit}</span>}
          </div>
          {subtitle && <p className="mt-2 text-xs text-zinc-500">{subtitle}</p>}
          {trend !== undefined && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs",
                trend.value >= 0 ? "text-emerald-400" : "text-red-400",
              )}
            >
              {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label ?? "vs last period"}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", colors.icon)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
