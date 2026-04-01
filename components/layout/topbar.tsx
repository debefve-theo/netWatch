"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";
import { useSidebar } from "@/lib/contexts/sidebar-context";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/analytics": "Analytics",
  "/dashboard/devices": "Devices",
  "/dashboard/users": "Users",
  "/dashboard/infrastructure": "Infrastructure",
  "/dashboard/logs": "Logs",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [key, label] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key + "/")) return label;
  }
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const title = getTitle(pathname);

  const [time, setTime] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    const clock = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 800);
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6",
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-zinc-100">{title}</h1>
        <span className="hidden text-xs text-zinc-600 sm:inline">/</span>
        <span className="hidden text-xs text-zinc-500 sm:inline">
          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Auto-refresh badge */}
        <div className="hidden items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 sm:flex">
          <RefreshCw
            className={cn("h-3 w-3 text-zinc-400 transition-transform", refreshing && "animate-spin text-blue-400")}
          />
          <span className="font-mono text-xs text-zinc-400">
            {refreshing ? "Syncing…" : `${countdown}s`}
          </span>
        </div>

        {/* Clock */}
        <span className="hidden font-mono text-xs text-zinc-500 sm:inline">{time}</span>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-700" />

        <UserMenu />
      </div>
    </header>
  );
}
