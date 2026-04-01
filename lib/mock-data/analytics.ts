export type DailyPoint = { date: string; p50: number; p95: number; p99: number };
export type DevicePerf = { device: string; avgDown: number; avgUp: number; avgPing: number; tests: number };
export type HeatmapCell = { hour: number; day: number; value: number };

function rnd(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

export function generateDailyPercentiles(days = 30): DailyPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    return {
      date: d.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      p50: rnd(200, 700),
      p95: rnd(700, 920),
      p99: rnd(900, 980),
    };
  });
}

export const devicePerformance: DevicePerf[] = [
  { device: "RPi-HQ-Paris", avgDown: 912, avgUp: 457, avgPing: 5.1, tests: 2184 },
  { device: "RPi-Branch-Lyon", avgDown: 341, avgUp: 178, avgPing: 11.8, tests: 1092 },
  { device: "RPi-Remote-Lille", avgDown: 187, avgUp: 88, avgPing: 24.3, tests: 876 },
  { device: "RPi-DC-Marseille", avgDown: 965, avgUp: 483, avgPing: 4.2, tests: 2190 },
  { device: "RPi-Backup-Bordeaux", avgDown: 124, avgUp: 62, avgPing: 41.7, tests: 432 },
];

export function generateHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ hour, day, value: Math.floor(rnd(20, 980)) });
    }
  }
  return cells;
}
