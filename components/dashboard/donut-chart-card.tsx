"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCardSkeleton } from "@/components/ui/loading-skeleton";

type DonutSlice = { name: string; value: number; color: string };

type DonutChartCardProps = {
  title: string;
  subtitle?: string;
  data: DonutSlice[];
  total?: number;
  totalLabel?: string;
  height?: number;
  loading?: boolean;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: DonutSlice }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="text-zinc-300">{d.name}</span>
        <span className="ml-2 font-mono font-medium text-zinc-100">{d.value}%</span>
      </div>
    </div>
  );
}

export function DonutChartCard({ title, subtitle, data, total, totalLabel, height = 240, loading = false }: DonutChartCardProps) {
  if (loading) return <ChartCardSkeleton height={height} />;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0" style={{ height, width: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="82%"
                dataKey="value"
                strokeWidth={0}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {total !== undefined && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-zinc-100">{total}</span>
              {totalLabel && <span className="text-[10px] text-zinc-500">{totalLabel}</span>}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-zinc-400">{item.name}</span>
              </div>
              <span className="font-mono text-xs font-medium text-zinc-200">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
