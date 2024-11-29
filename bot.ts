import { BOT_TOKEN } from "./token.ts";
import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { botStart } from "./botModules/botStart.ts";

const bot = new Bot(BOT_TOKEN);

bot.callbackQuery("info", async (ctx) => {
});

bot.callbackQuery("subscribe", async (ctx) => {
});

bot.callbackQuery("unsubscribe", async (ctx) => {
});

bot.callbackQuery("subscribersList", async (ctx) => {
});

bot.callbackQuery("userMode", async (ctx) => {
});

bot.command("start", async (ctx) => {
  await botStart(ctx);
});

bot.start();
