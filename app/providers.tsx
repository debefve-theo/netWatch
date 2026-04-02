"use client";

import { SidebarProvider } from "@/lib/contexts/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
