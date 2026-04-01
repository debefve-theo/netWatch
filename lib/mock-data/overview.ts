export type TimePoint = { time: string; download: number; upload: number };
export type LatencyPoint = { time: string; ping: number; jitter: number };
export type BarPoint = { label: string; value: number };
export type DonutSlice = { name: string; value: number; color: string };
export type ActivityRow = {
  id: string;
  device: string;
  download: number;
  upload: number;
  ping: number;
  isp: string;
  status: "good" | "warn" | "error";
  time: string;
};
export type CountryRow = { country: string; flag: string; tests: number; avgDownload: number; share: number };

function rnd(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function timeLabel(offsetHours: number) {
  const d = new Date(Date.now() - offsetHours * 3600000);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function generateSpeedTimeline(points = 24): TimePoint[] {
  return Array.from({ length: points }, (_, i) => ({
    time: timeLabel(points - 1 - i),
    download: rnd(80, 940),
    upload: rnd(40, 480),
  }));
}

export function generateLatencyTimeline(points = 24): LatencyPoint[] {
  return Array.from({ length: points }, (_, i) => ({
    time: timeLabel(points - 1 - i),
    ping: rnd(4, 38),
    jitter: rnd(0.5, 12),
  }));
}

export function generateHourlyTests(points = 12): BarPoint[] {
  const labels = ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];
  return labels.slice(0, points).map((label) => ({ label, value: Math.floor(rnd(2, 18)) }));
}

export const ispDonut: DonutSlice[] = [
  { name: "Orange", value: 38, color: "#f97316" },
  { name: "SFR", value: 27, color: "#3b82f6" },
  { name: "Free", value: 22, color: "#8b5cf6" },
  { name: "Bouygues", value: 13, color: "#10b981" },
];

export const countryData: CountryRow[] = [
  { country: "France", flag: "🇫🇷", tests: 1842, avgDownload: 412, share: 64 },
  { country: "Germany", flag: "🇩🇪", tests: 534, avgDownload: 387, share: 18 },
  { country: "UK", flag: "🇬🇧", tests: 289, avgDownload: 356, share: 10 },
  { country: "Spain", flag: "🇪🇸", tests: 142, avgDownload: 298, share: 5 },
  { country: "Italy", flag: "🇮🇹", tests: 87, avgDownload: 271, share: 3 },
];

export const recentActivity: ActivityRow[] = [
  { id: "1", device: "RPi-HQ-Paris", download: 921.4, upload: 462.1, ping: 5.2, isp: "Orange", status: "good", time: "2 min ago" },
  { id: "2", device: "RPi-Branch-Lyon", download: 342.7, upload: 178.3, ping: 12.1, isp: "SFR", status: "good", time: "4 min ago" },
  { id: "3", device: "RPi-Remote-Lille", download: 48.3, upload: 22.1, ping: 87.4, isp: "Bouygues", status: "warn", time: "7 min ago" },
  { id: "4", device: "RPi-DC-Marseille", download: 988.1, upload: 501.3, ping: 3.9, isp: "Free", status: "good", time: "12 min ago" },
  { id: "5", device: "RPi-Backup-Bordeaux", download: 0, upload: 0, ping: 0, isp: "Orange", status: "error", time: "18 min ago" },
  { id: "6", device: "RPi-HQ-Paris", download: 918.2, upload: 459.8, ping: 5.4, isp: "Orange", status: "good", time: "32 min ago" },
];
