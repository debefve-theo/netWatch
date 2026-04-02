"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  HardDrive,
  ScrollText,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/contexts/sidebar-context";
import type { DeviceSummary, DeviceStatus } from "@/types";

type SidebarProps = {
  devices: DeviceSummary[];
};

const statusDot: Record<DeviceStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-red-500",
  unknown: "bg-zinc-500",
};

export function Sidebar({ devices }: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  const isLogsActive = pathname === "/dashboard/logs";
  const isDevicesActive = pathname === "/dashboard/devices";

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-[220px]",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-zinc-800 px-4",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">NetWatch</p>
              <p className="truncate text-[10px] text-zinc-500">Network Monitor</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {/* Devices section */}
          {!collapsed && (
            <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Devices
            </p>
          )}

          {devices.length === 0 && !collapsed && (
            <p className="px-3 py-2 text-xs text-zinc-600">No device configured</p>
          )}

          {devices.map((device) => {
            const active = pathname === `/dashboard/devices/${device.id}` ||
              pathname.startsWith(`/dashboard/devices/${device.id}/`);

            return (
              <Link
                key={device.id}
                href={`/dashboard/devices/${device.id}`}
                title={collapsed ? device.name : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                {collapsed ? (
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", statusDot[device.status])}
                  />
                ) : (
                  <>
                    <HardDrive className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 truncate text-xs">{device.name}</span>
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDot[device.status])}
                    />
                  </>
                )}
              </Link>
            );
          })}

          {/* Logs */}
          <div className={cn("mt-4", !collapsed && "pt-3 border-t border-zinc-800/70")}>
            {!collapsed && (
              <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                System
              </p>
            )}
            <Link
              href="/dashboard/logs"
              title={collapsed ? "Logs" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                collapsed && "justify-center px-2",
                isLogsActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
              )}
            >
              <ScrollText className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Logs</span>}
            </Link>
          </div>
        </nav>

        {/* Collapse toggle */}
        <div className="shrink-0 border-t border-zinc-800 p-2">
          <button
            onClick={toggle}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-zinc-800 bg-zinc-950 lg:hidden">
        {devices.slice(0, 4).map((device) => {
          const active = pathname.startsWith(`/dashboard/devices/${device.id}`);
          return (
            <Link
              key={device.id}
              href={`/dashboard/devices/${device.id}`}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] transition-colors",
                active ? "text-blue-400" : "text-zinc-500",
              )}
            >
              <div className="relative">
                <HardDrive className="h-4 w-4" />
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full",
                    statusDot[device.status],
                  )}
                />
              </div>
              <span className="max-w-[56px] truncate">{device.name.replace(/^RPi-/, "")}</span>
            </Link>
          );
        })}
        <Link
          href="/dashboard/logs"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] transition-colors",
            pathname === "/dashboard/logs" ? "text-blue-400" : "text-zinc-500",
          )}
        >
          <ScrollText className="h-4 w-4" />
          <span>Logs</span>
        </Link>
      </nav>
    </>
  );
}
