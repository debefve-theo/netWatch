import type { NetworkQuality } from "@/lib/network-quality";
import { cn } from "@/lib/utils";

const qualityClasses: Record<NetworkQuality, string> = {
  excellent: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  good: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  fair: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  poor: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  unknown: "border-zinc-600 bg-zinc-700/40 text-zinc-400",
};

export function NetworkQualityBadge({ quality }: { quality: NetworkQuality }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        qualityClasses[quality],
      )}
    >
      {quality}
    </span>
  );
}
