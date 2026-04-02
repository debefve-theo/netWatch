"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/contexts/sidebar-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { DeviceSummary } from "@/types";

type DashboardShellProps = {
  devices: DeviceSummary[];
  children: React.ReactNode;
};

export function DashboardShell({ devices, children }: DashboardShellProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar devices={devices} />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-[220px]",
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8 pb-20 lg:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
