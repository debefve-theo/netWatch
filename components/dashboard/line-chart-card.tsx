"use client";

import { RefreshCw } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";

type Series = { key: string; color: string; label: string };

type LineChartCardProps = {
  title: string;
  subtitle?: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: Series[];
  unit?: string;
  height?: number;
  loading?: boolean;
  error?: boolean;
  onRefresh?: () => void;
};

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 text-zinc-400">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-300">{p.name}</span>
          <span className="ml-auto font-mono font-medium text-zinc-100">
            {p.value}
            {unit && <span className="text-zinc-500"> {unit}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LineChartCard({
  title,
  subtitle,
  data,
  xKey,
  series,
  unit,
  height = 260,
  loading = false,
  error = false,
  onRefresh,
}: LineChartCardProps) {
  if (loading) return <ChartCardSkeleton height={height} />;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error ? (
        <ErrorState compact />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="rgba(63,63,70,0.6)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
              width={42}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {series.length > 1 && (
              <Legend
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: "11px", color: "#a1a1aa", paddingTop: "8px" }}
              />
            )}
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
