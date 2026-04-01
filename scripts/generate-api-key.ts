import { generateApiKey, hashApiKey } from "../lib/crypto";

async function main() {
  const rawKey = generateApiKey();
  const hash = await hashApiKey(rawKey);

  console.log("Raw API key:");
  console.log(rawKey);
  console.log("");
  console.log("Hashed API key:");
  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
