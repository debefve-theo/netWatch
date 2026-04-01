import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
};

export function ErrorState({ message = "Failed to load data", onRetry, compact = false }: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        compact ? "py-8" : "py-16"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-300">{message}</p>
        <p className="mt-1 text-xs text-zinc-500">Check your connection and try again</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}
