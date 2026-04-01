import { useQuery } from "@tanstack/react-query";
import {
  generateSpeedTimeline,
  generateLatencyTimeline,
  generateHourlyTests,
  ispDonut,
  countryData,
  recentActivity,
} from "@/lib/mock-data/overview";

async function fetchOverviewData() {
  await new Promise((r) => setTimeout(r, 600));
  return {
    kpis: {
      avgDownload: 521.4,
      avgUpload: 261.7,
      avgPing: 11.2,
      packetLoss: 0.4,
      totalTests: 2875,
      devicesOnline: 4,
      devicesTotal: 5,
    },
    speedTimeline: generateSpeedTimeline(24),
    latencyTimeline: generateLatencyTimeline(24),
    hourlyTests: generateHourlyTests(12),
    ispDonut,
    countryData,
    recentActivity,
  };
}

export function useOverviewData() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverviewData,
  });
}
