import { BOT_TOKEN } from "./config.ts";
import { Bot } from "@grammyjs/bot";
import { botStart } from "./botModules/botStart.ts";
import { info } from "./botStatic/info.ts";
import {
  activateSubscription,
  deactivateSubscription,
  getListActiveSubscribers,
} from "./db.ts";

const bot = new Bot(BOT_TOKEN);

bot.callbackQuery("info", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(info);
});

bot.callbackQuery("subscribe", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (userId) {
    await activateSubscription(userId);
    await ctx.reply("Вы успешно подписались на рассылку!");
  }
});

bot.callbackQuery("unsubscribe", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (userId) {
    await deactivateSubscription(userId);
    await ctx.reply("Вы успешно отписались от рассылки!");
  }
});

bot.callbackQuery("subscribersList", async (ctx) => {
  await ctx.answerCallbackQuery();
  const subscribers = await getListActiveSubscribers();
  await ctx.reply(subscribers);
});

bot.command("start", async (ctx) => {
  await botStart(ctx);
});

export { bot };
