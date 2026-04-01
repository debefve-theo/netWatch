import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-700/50", className)} {...props} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
    </div>
  );
}

export function ChartCardSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800">
      <div className="border-b border-zinc-700 px-5 py-4">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="divide-y divide-zinc-700/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ml-auto h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
