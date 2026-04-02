"use client";

import { startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/types";

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "3d", label: "3d" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

type RangeSelectorProps = {
  currentRange: TimeRange;
};

export function RangeSelector({ currentRange }: RangeSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function setRange(range: TimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    params.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => setRange(r.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition",
            currentRange === r.value
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
