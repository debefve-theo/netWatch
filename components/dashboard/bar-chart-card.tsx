"use client";

import { RefreshCw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";

type BarChartCardProps = {
  title: string;
  subtitle?: string;
  data: { label: string; value: number }[];
  color?: string;
  unit?: string;
  height?: number;
  loading?: boolean;
  error?: boolean;
  onRefresh?: () => void;
};

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 text-zinc-400">{label}</p>
      <p className="font-mono font-medium text-zinc-100">
        {payload[0].value}
        {unit && <span className="text-zinc-500"> {unit}</span>}
      </p>
    </div>
  );
}

export function BarChartCard({
  title,
  subtitle,
  data,
  color = "#3b82f6",
  unit,
  height = 240,
  loading = false,
  error = false,
  onRefresh,
}: BarChartCardProps) {
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
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="rgba(63,63,70,0.6)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} width={42} />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {data.map((_, i) => (
                <Cell key={i} fill={color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
