import { listDevices } from "@/lib/queries";
import { Providers } from "@/app/providers";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const devices = await listDevices();

  return (
    <Providers>
      <DashboardShell devices={devices}>{children}</DashboardShell>
    </Providers>
  );
}
