import { useQuery } from "@tanstack/react-query";
import { ispData, serverData, generateBandwidth } from "@/lib/mock-data/infrastructure";

async function fetchInfrastructure() {
  await new Promise((r) => setTimeout(r, 450));
  return {
    isps: ispData,
    servers: serverData,
    bandwidth: generateBandwidth(24),
  };
}

export function useInfrastructureData() {
  return useQuery({
    queryKey: ["infrastructure"],
    queryFn: fetchInfrastructure,
  });
}
