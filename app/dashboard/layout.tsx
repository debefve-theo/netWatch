"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Providers } from "@/app/providers";
import { useSidebar } from "@/lib/contexts/sidebar-context";
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-[64px]" : "lg:ml-[220px]",
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardContent>{children}</DashboardContent>
    </Providers>
  );
}
