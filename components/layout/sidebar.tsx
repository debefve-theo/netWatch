"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  LayoutDashboard,
  Layers,
  ScrollText,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/contexts/sidebar-context";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/devices", label: "Devices", icon: HardDrive },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/infrastructure", label: "Infrastructure", icon: Layers },
  { href: "/dashboard/logs", label: "Logs", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

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
            "flex h-14 items-center border-b border-zinc-800 px-4",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">NetPulse</p>
              <p className="truncate text-[10px] text-zinc-500">Network Monitor</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {navigation.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-zinc-800 p-2">
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
        {navigation.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] transition-colors",
                active ? "text-blue-400" : "text-zinc-500",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
