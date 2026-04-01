export type Device = {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "degraded";
  isp: string;
  lastSeen: string;
  uptime: number;
  testsToday: number;
  avgDownload: number;
  avgUpload: number;
  avgPing: number;
  ip: string;
  model: string;
};

export const mockDevices: Device[] = [
  {
    id: "d1",
    name: "RPi-HQ-Paris",
    location: "Paris, FR",
    status: "online",
    isp: "Orange",
    lastSeen: "Just now",
    uptime: 99.8,
    testsToday: 48,
    avgDownload: 912.4,
    avgUpload: 457.1,
    avgPing: 5.1,
    ip: "82.67.x.x",
    model: "Raspberry Pi 4B",
  },
  {
    id: "d2",
    name: "RPi-Branch-Lyon",
    location: "Lyon, FR",
    status: "online",
    isp: "SFR",
    lastSeen: "2 min ago",
    uptime: 98.4,
    testsToday: 47,
    avgDownload: 341.2,
    avgUpload: 178.3,
    avgPing: 11.8,
    ip: "81.57.x.x",
    model: "Raspberry Pi 4B",
  },
  {
    id: "d3",
    name: "RPi-Remote-Lille",
    location: "Lille, FR",
    status: "degraded",
    isp: "Bouygues",
    lastSeen: "7 min ago",
    uptime: 87.2,
    testsToday: 41,
    avgDownload: 187.4,
    avgUpload: 88.1,
    avgPing: 24.3,
    ip: "90.14.x.x",
    model: "Raspberry Pi 3B+",
  },
  {
    id: "d4",
    name: "RPi-DC-Marseille",
    location: "Marseille, FR",
    status: "online",
    isp: "Free",
    lastSeen: "Just now",
    uptime: 99.9,
    testsToday: 48,
    avgDownload: 965.3,
    avgUpload: 483.2,
    avgPing: 4.2,
    ip: "195.25.x.x",
    model: "Raspberry Pi 4B",
  },
  {
    id: "d5",
    name: "RPi-Backup-Bordeaux",
    location: "Bordeaux, FR",
    status: "offline",
    isp: "Orange",
    lastSeen: "18 min ago",
    uptime: 62.1,
    testsToday: 12,
    avgDownload: 0,
    avgUpload: 0,
    avgPing: 0,
    ip: "86.251.x.x",
    model: "Raspberry Pi Zero 2W",
  },
];
