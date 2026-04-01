import { useQuery } from "@tanstack/react-query";
import {
  generateDailyPercentiles,
  devicePerformance,
} from "@/lib/mock-data/analytics";

async function fetchAnalyticsData() {
  await new Promise((r) => setTimeout(r, 500));
  return {
    percentiles: generateDailyPercentiles(30),
    devicePerformance,
  };
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
  });
}
