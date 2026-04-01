import { useQuery } from "@tanstack/react-query";
import { mockLogs } from "@/lib/mock-data/logs";

async function fetchLogs() {
  await new Promise((r) => setTimeout(r, 350));
  return mockLogs;
}

export function useLogsData() {
  return useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });
}
