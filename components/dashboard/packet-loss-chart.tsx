"use client";

import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SpeedtestRow } from "@/types";
import { SectionCard } from "./section-card";

export function PacketLossChart({ data }: { data: SpeedtestRow[] }) {
  return (
    <SectionCard title="Packet loss" description="Loss percentage over time">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
                backgroundColor: "#1f1f22",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
              }}
              formatter={(value: number) => [`${value.toFixed(2)} %`, "Packet loss"]}
              labelFormatter={(value) => format(new Date(value), "dd MMM yyyy HH:mm")}
            />
            <Bar dataKey="packetLoss" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
