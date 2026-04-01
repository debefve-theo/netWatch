import { useQuery } from "@tanstack/react-query";
import { mockDevices } from "@/lib/mock-data/devices";

async function fetchDevices() {
  await new Promise((r) => setTimeout(r, 400));
  return mockDevices;
}

export function useDevicesData() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });
}
