import { HardDrive } from "lucide-react";
import { DeviceList } from "@/components/dashboard/device-list";
import { EmptyState } from "@/components/ui/empty-state";
import { listDevices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const devices = await listDevices();
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Devices", value: devices.length, color: "text-zinc-100" },
          { label: "Online", value: online, color: "text-emerald-400" },
          { label: "Offline", value: offline, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-zinc-700 bg-zinc-800 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
            <p className={`mt-3 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Device list */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800">
        <div className="flex items-center gap-3 border-b border-zinc-700 px-5 py-3.5">
          <HardDrive className="h-4 w-4 text-zinc-500" />
          <p className="text-sm font-semibold text-zinc-100">Inventory</p>
          <span className="ml-auto text-xs text-zinc-500">{devices.length} device(s)</span>
        </div>
        <div className="p-5">
          {devices.length > 0 ? (
            <DeviceList devices={devices} />
          ) : (
            <EmptyState
              compact
              title="No device configured"
              description="Create a Raspberry Pi device first, then point the client script to the ingest API."
            />
          )}
        </div>
      </div>
    </div>
  );
}
