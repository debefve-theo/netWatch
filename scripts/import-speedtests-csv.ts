import { readFile } from "node:fs/promises";
import { stdin as input } from "node:process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CsvRow = {
  deviceId: string;
  measuredAt: Date;
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  packetLoss: number;
  isp: string | null;
  externalIp: string | null;
  serverId: string | null;
  serverName: string | null;
  serverLocation: string | null;
  serverCountry: string | null;
  resultUrl: string | null;
};

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of input) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        current += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function nullable(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  return value;
}

function parseRow(line: string, lineNumber: number): CsvRow {
  const columns = parseCsvLine(line);

  if (columns.length !== 14) {
    throw new Error(`Line ${lineNumber}: expected 14 columns, got ${columns.length}`);
  }

  const measuredAt = new Date(columns[1]);
  if (Number.isNaN(measuredAt.getTime())) {
    throw new Error(`Line ${lineNumber}: invalid measuredAt "${columns[1]}"`);
  }

  const toNumber = (value: string, label: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Line ${lineNumber}: invalid ${label} "${value}"`);
    }
    return parsed;
  };

  return {
    deviceId: columns[0],
    measuredAt,
    pingMs: toNumber(columns[2], "pingMs"),
    jitterMs: toNumber(columns[3], "jitterMs"),
    downloadMbps: toNumber(columns[4], "downloadMbps"),
    uploadMbps: toNumber(columns[5], "uploadMbps"),
    packetLoss: toNumber(columns[6], "packetLoss"),
    isp: nullable(columns[7]),
    externalIp: nullable(columns[8]),
    serverId: nullable(columns[9]),
    serverName: nullable(columns[10]),
    serverLocation: nullable(columns[11]),
    serverCountry: nullable(columns[12]),
    resultUrl: nullable(columns[13]),
  };
}

async function readSource(): Promise<string> {
  const file = readArg("file");
  if (file) {
    return readFile(file, "utf-8");
  }

  if (!input.isTTY) {
    return readStdin();
  }

  throw new Error("Provide --file <path> or pipe CSV rows on stdin.");
}

async function main() {
  const raw = await readSource();
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"));

  const dataLines =
    lines[0]?.startsWith("deviceId,") ?
      lines.slice(1)
    : lines;

  if (dataLines.length === 0) {
    throw new Error("No CSV rows found.");
  }

  const rows = dataLines.map((line, index) => parseRow(line, index + 1));
  const deviceIds = Array.from(new Set(rows.map((row) => row.deviceId)));
  const devices = await prisma.device.findMany({
    where: { id: { in: deviceIds } },
    select: { id: true, lastSeenAt: true },
  });

  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const missingDeviceIds = deviceIds.filter((deviceId) => !deviceMap.has(deviceId));
  if (missingDeviceIds.length > 0) {
    throw new Error(`Unknown device IDs: ${missingDeviceIds.join(", ")}`);
  }

  const result = await prisma.speedtestResult.createMany({
    data: rows,
    skipDuplicates: true,
  });

  const latestByDevice = new Map<string, Date>();
  for (const row of rows) {
    const current = latestByDevice.get(row.deviceId);
    if (!current || row.measuredAt > current) {
      latestByDevice.set(row.deviceId, row.measuredAt);
    }
  }

  for (const [deviceId, importedLatest] of latestByDevice.entries()) {
    const currentLastSeenAt = deviceMap.get(deviceId)?.lastSeenAt;
    const nextLastSeenAt =
      currentLastSeenAt && currentLastSeenAt > importedLatest ? currentLastSeenAt : importedLatest;

    await prisma.device.update({
      where: { id: deviceId },
      data: { lastSeenAt: nextLastSeenAt },
    });
  }

  console.log(`Imported ${result.count} new speedtest result(s).`);
  console.log(`Processed ${rows.length} CSV row(s) for ${deviceIds.length} device(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
