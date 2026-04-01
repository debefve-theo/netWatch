import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  compact?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, compact = false, icon, action }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-800/40 text-center ${
        compact ? "py-10" : "py-16"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700/60">
        {icon ?? <Inbox className="h-5 w-5 text-zinc-400" />}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-300">{title}</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-500">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
