export type IspRow = {
  name: string;
  color: string;
  devices: number;
  avgDownload: number;
  avgUpload: number;
  avgPing: number;
  uptime: number;
};

export type ServerRow = {
  id: string;
  name: string;
  location: string;
  tests: number;
  avgPing: number;
  provider: string;
};

export type BandwidthPoint = { time: string; ingress: number; egress: number };

export const ispData: IspRow[] = [
  { name: "Orange", color: "#f97316", devices: 2, avgDownload: 518, avgUpload: 260, avgPing: 5.5, uptime: 99.8 },
  { name: "Free", color: "#3b82f6", devices: 1, avgDownload: 965, avgUpload: 483, avgPing: 4.2, uptime: 99.9 },
  { name: "SFR", color: "#8b5cf6", devices: 1, avgDownload: 341, avgUpload: 178, avgPing: 11.8, uptime: 98.4 },
  { name: "Bouygues", color: "#10b981", devices: 1, avgDownload: 187, avgUpload: 88, avgPing: 24.3, uptime: 87.2 },
];

export const serverData: ServerRow[] = [
  { id: "s1", name: "Speedtest Paris #1", location: "Paris, FR", tests: 1842, avgPing: 4.8, provider: "Ookla" },
  { id: "s2", name: "OVH Roubaix", location: "Roubaix, FR", tests: 934, avgPing: 7.2, provider: "OVH" },
  { id: "s3", name: "Scaleway Paris", location: "Paris, FR", tests: 712, avgPing: 5.1, provider: "Scaleway" },
  { id: "s4", name: "Cloudflare EU", location: "Frankfurt, DE", tests: 287, avgPing: 9.4, provider: "Cloudflare" },
];

function rnd(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

export function generateBandwidth(points = 24): BandwidthPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(Date.now() - (points - 1 - i) * 3600000);
    return {
      time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      ingress: rnd(120, 920),
      egress: rnd(60, 480),
    };
  });
}
