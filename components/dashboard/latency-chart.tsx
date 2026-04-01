"use client";

import { format } from "date-fns";
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
import type { SpeedtestRow } from "@/types";
import { SectionCard } from "./section-card";

export function LatencyChart({ data }: { data: SpeedtestRow[] }) {
  return (
    <SectionCard title="Latency and jitter" description="Lower is better">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              formatter={(value: number) => [`${value.toFixed(2)} ms`, ""]}
              labelFormatter={(value) => format(new Date(value), "dd MMM yyyy HH:mm")}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line dataKey="pingMs" dot={false} name="Ping" stroke="#8b5cf6" strokeWidth={2} type="monotone" />
            <Line dataKey="jitterMs" dot={false} name="Jitter" stroke="#f59e0b" strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
