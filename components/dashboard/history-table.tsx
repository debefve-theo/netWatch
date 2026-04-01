import Link from "next/link";
import type { SpeedtestRow } from "@/types";
import { formatDateTime, formatMbps, formatMs, formatPercent } from "@/lib/utils";

type HistoryTableProps = {
  title: string;
  description?: string;
  results: SpeedtestRow[];
  emptyDescription: string;
  footerHref?: string;
  footerLabel?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    makeHref: (page: number) => string;
  };
};

export function HistoryTable({
  title,
  description,
  results,
  emptyDescription,
  footerHref,
  footerLabel,
  pagination,
}: HistoryTableProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800">
      <div className="border-b border-zinc-700 px-5 py-3.5">
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
      </div>

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            <thead>
              <tr className="border-b border-zinc-700/50">
                {["Measured at", "Download", "Upload", "Ping", "Jitter", "Loss", "Server"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/30">
              {results.map((result) => (
                <tr key={result.id} className="transition hover:bg-zinc-700/20">
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-400">{formatDateTime(result.measuredAt)}</td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-200">{formatMbps(result.downloadMbps)} <span className="text-zinc-500">Mbps</span></td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-200">{formatMbps(result.uploadMbps)} <span className="text-zinc-500">Mbps</span></td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-200">{formatMs(result.pingMs)} <span className="text-zinc-500">ms</span></td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-200">{formatMs(result.jitterMs)} <span className="text-zinc-500">ms</span></td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-zinc-200">{formatPercent(result.packetLoss)} <span className="text-zinc-500">%</span></td>
                  <td className="px-5 py-3 text-zinc-400">
                    {result.serverName ?? "Unknown"}
                    {result.serverLocation ? `, ${result.serverLocation}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-zinc-500">{emptyDescription}</p>
      )}

      {(footerHref && footerLabel) || pagination ? (
        <div className="flex flex-col gap-3 border-t border-zinc-700/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          {footerHref && footerLabel ? (
            <Link className="text-xs text-blue-400 transition hover:text-blue-300" href={footerHref}>
              {footerLabel} →
            </Link>
          ) : (
            <span />
          )}
          {pagination ? (
            <div className="flex items-center gap-2">
              <Link
                aria-disabled={pagination.currentPage <= 1}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                href={pagination.makeHref(Math.max(1, pagination.currentPage - 1))}
              >
                Previous
              </Link>
              <span className="text-xs text-zinc-500">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <Link
                aria-disabled={pagination.currentPage >= pagination.totalPages}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                href={pagination.makeHref(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              >
                Next
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
