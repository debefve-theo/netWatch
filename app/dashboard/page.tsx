import { redirect } from "next/navigation";
import { listDevices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardRootPage() {
  const devices = await listDevices();
  if (devices.length > 0) {
    redirect(`/dashboard/devices/${devices[0].id}`);
  }
  redirect("/dashboard/devices");
}
