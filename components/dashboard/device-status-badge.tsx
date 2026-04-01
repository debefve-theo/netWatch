import type { DeviceStatus } from "@/types";
import { cn } from "@/lib/utils";

const badgeClasses: Record<DeviceStatus, string> = {
  online: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  offline: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  unknown: "border-zinc-600 bg-zinc-700/40 text-zinc-400",
};

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        badgeClasses[status],
      )}
    >
      {status}
    </span>
  );
}
