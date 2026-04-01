/**
 * Seed script — creates a demo device and prints its API key.
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { hashApiKey, generateApiKey } from "../lib/crypto";

const prisma = new PrismaClient();

async function main() {
  const rawKey = generateApiKey();
  const hash = await hashApiKey(rawKey);
  const name = process.env.SEED_DEVICE_NAME ?? "Raspberry Pi";
  const locationLabel = process.env.SEED_DEVICE_LOCATION ?? null;

  const existing = await prisma.device.findFirst({
    where: { name },
    select: { id: true },
  });

  const device = existing
    ? await prisma.device.update({
        where: { id: existing.id },
        data: {
          apiKeyHash: hash,
          locationLabel,
          enabled: true,
        },
      })
    : await prisma.device.create({
        data: {
          name,
          locationLabel,
          apiKeyHash: hash,
          enabled: true,
        },
      });

  console.log("✅ Device created:");
  console.log(`   ID:      ${device.id}`);
  console.log(`   Name:    ${device.name}`);
  console.log(`   API Key: ${rawKey}`);
  console.log("");
  console.log("⚠️  Save this API key — it will NOT be shown again.");
  console.log("   Add it to your Raspberry Pi .env as SPEEDTEST_API_KEY");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
