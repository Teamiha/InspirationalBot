import { BOT_TOKEN } from "./token.ts";
import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { botStart } from "./botModules/botStart.ts";

const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx) => {
  await botStart(ctx);
});

bot.start();
