export type LogLevel = "info" | "warn" | "error" | "debug";

export type LogEntry = {
  id: string;
  timestamp: string;
  level: LogLevel;
  device: string;
  message: string;
  details?: string;
};

const now = Date.now();

export const mockLogs: LogEntry[] = [
  { id: "l1", timestamp: new Date(now - 120000).toISOString(), level: "info", device: "RPi-HQ-Paris", message: "Speedtest completed successfully", details: "↓ 921.4 Mbps  ↑ 462.1 Mbps  ping 5.2ms" },
  { id: "l2", timestamp: new Date(now - 240000).toISOString(), level: "warn", device: "RPi-Remote-Lille", message: "High latency detected", details: "ping 87.4ms — threshold 50ms" },
  { id: "l3", timestamp: new Date(now - 360000).toISOString(), level: "error", device: "RPi-Backup-Bordeaux", message: "Device unreachable — connection timeout", details: "Last successful contact 18 min ago" },
  { id: "l4", timestamp: new Date(now - 480000).toISOString(), level: "info", device: "RPi-DC-Marseille", message: "Speedtest completed successfully", details: "↓ 988.1 Mbps  ↑ 501.3 Mbps  ping 3.9ms" },
  { id: "l5", timestamp: new Date(now - 720000).toISOString(), level: "info", device: "RPi-Branch-Lyon", message: "Speedtest completed successfully", details: "↓ 342.7 Mbps  ↑ 178.3 Mbps  ping 12.1ms" },
  { id: "l6", timestamp: new Date(now - 960000).toISOString(), level: "debug", device: "RPi-HQ-Paris", message: "API key validated", details: "Bearer token hash match OK" },
  { id: "l7", timestamp: new Date(now - 1200000).toISOString(), level: "warn", device: "RPi-Remote-Lille", message: "Packet loss above threshold", details: "1.8% — threshold 1%" },
  { id: "l8", timestamp: new Date(now - 1800000).toISOString(), level: "info", device: "RPi-DC-Marseille", message: "Device registered & online", details: "First contact after 3h offline window" },
  { id: "l9", timestamp: new Date(now - 2400000).toISOString(), level: "error", device: "RPi-Backup-Bordeaux", message: "Speedtest binary exited with code 1", details: "No route to host — network interface down" },
  { id: "l10", timestamp: new Date(now - 3600000).toISOString(), level: "info", device: "RPi-Branch-Lyon", message: "Configuration updated remotely", details: "interval: 30min → 20min" },
  { id: "l11", timestamp: new Date(now - 7200000).toISOString(), level: "debug", device: "RPi-HQ-Paris", message: "Health check OK", details: "All systems nominal" },
  { id: "l12", timestamp: new Date(now - 10800000).toISOString(), level: "warn", device: "RPi-Remote-Lille", message: "ISP throttling suspected", details: "download 48 Mbps — baseline 187 Mbps" },
];
