"use client";

import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SpeedtestRow } from "@/types";
import { SectionCard } from "./section-card";

type SpeedMetric = "downloadMbps" | "uploadMbps";

type SpeedChartProps = {
  data: SpeedtestRow[];
  metric: SpeedMetric;
  title: string;
  color: string;
};

export function SpeedChart({ data, metric, title, color }: SpeedChartProps) {
  return (
    <SectionCard title={title} description="Historical throughput">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`${metric}-gradient`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="measuredAt"
              minTickGap={24}
              axisLine={false}
              tickLine={false}
              stroke="rgba(148, 163, 184, 0.5)"
              tickFormatter={(value) => format(new Date(value), "dd/MM HH:mm")}
            />
            <YAxis axisLine={false} tickLine={false} stroke="rgba(148, 163, 184, 0.5)" width={52} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
              }}
              formatter={(value: number) => [`${value.toFixed(2)} Mbps`, metric === "downloadMbps" ? "Download" : "Upload"]}
              labelFormatter={(value) => format(new Date(value), "dd MMM yyyy HH:mm")}
            />
            <Area
              dataKey={metric}
              fill={`url(#${metric}-gradient)`}
              fillOpacity={1}
              stroke={color}
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
