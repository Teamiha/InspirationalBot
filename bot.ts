import { BOT_TOKEN } from "./config.ts"
import { Bot } from "@grammyjs/bot";
import { botStart } from "./botModules/botStart.ts";
import { info } from "./botStatic/info.ts";
import { activateSubscription, deactivateSubscription, getListActiveSubscribers } from "./db.ts";


import { getMailingList } from "./db.ts";
import { getTodayTask } from "./botStatic/taskManager.ts";
import { getTodayImage } from "./botStatic/imageManager.ts";
import { getTodayWish } from "./botStatic/wishesManager.ts";

import { broadcastMessageWithImage } from "./botModules/botSendMessages.ts";

const bot = new Bot(BOT_TOKEN);

bot.callbackQuery("test", async (ctx) => {
    await ctx.answerCallbackQuery();
    const subscribers = await getMailingList();
        const task = await getTodayTask();
        const image = await getTodayImage();
        const wish = await getTodayWish();
        const fullMessage = `${task}\n\n${wish}`;

        await broadcastMessageWithImage(bot, subscribers, fullMessage, image);
  });

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
