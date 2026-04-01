import { cn } from "@/lib/utils";
import type { ActivityRow } from "@/lib/mock-data/overview";

type ActivityTableProps = {
  data: ActivityRow[];
};

const statusClasses = {
  good: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels = { good: "OK", warn: "Degraded", error: "Error" };

export function ActivityTable({ data }: ActivityTableProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-3.5">
        <p className="text-sm font-semibold text-zinc-100">Recent Tests</p>
        <span className="text-xs text-zinc-500">{data.length} entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-xs">
          <thead>
            <tr className="border-b border-zinc-700/50">
              {["Device", "↓ Down", "↑ Up", "Ping", "ISP", "Status", "Time"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700/30">
            {data.map((row) => (
              <tr key={row.id} className="transition hover:bg-zinc-700/20">
                <td className="px-5 py-3 font-medium text-zinc-200">{row.device}</td>
                <td className="px-5 py-3 font-mono text-zinc-300">
                  {row.download > 0 ? `${row.download.toFixed(1)}` : "—"}
                  <span className="text-zinc-500"> Mbps</span>
                </td>
                <td className="px-5 py-3 font-mono text-zinc-300">
                  {row.upload > 0 ? `${row.upload.toFixed(1)}` : "—"}
                  <span className="text-zinc-500"> Mbps</span>
                </td>
                <td className="px-5 py-3 font-mono text-zinc-300">
                  {row.ping > 0 ? `${row.ping.toFixed(1)}` : "—"}
                  <span className="text-zinc-500"> ms</span>
                </td>
                <td className="px-5 py-3 text-zinc-400">{row.isp}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      statusClasses[row.status],
                    )}
                  >
                    {statusLabels[row.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-zinc-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
