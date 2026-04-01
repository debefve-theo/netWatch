import { PrismaClient } from "@prisma/client";
import { generateApiKey, hashApiKey } from "../lib/crypto";

const prisma = new PrismaClient();

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

async function main() {
  const name = readArg("name");
  const location = readArg("location");

  if (!name) {
    throw new Error('Missing required flag `--name`. Example: npm run create-device -- --name "Raspberry Pi"');
  }

  const rawKey = generateApiKey();
  const apiKeyHash = await hashApiKey(rawKey);

  const device = await prisma.device.create({
    data: {
      name,
      locationLabel: location,
      apiKeyHash,
      enabled: true,
    },
  });

  console.log("✅ Device created");
  console.log(`ID:       ${device.id}`);
  console.log(`Name:     ${device.name}`);
  console.log(`Location: ${device.locationLabel ?? "-"}`);
  console.log(`API Key:  ${rawKey}`);
  console.log("");
  console.log("Store this API key securely. It is not recoverable from the hash.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
