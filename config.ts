export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
export const SUPERUSER = Deno.env.get("SUPERUSER") || "";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is required");
}

if (!SUPERUSER) {
  throw new Error("SUPERUSER environment variable is required");
}
