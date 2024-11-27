import { BOT_TOKEN } from "./token.ts";
import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";

const bot = new Bot(BOT_TOKEN);


bot.command("start", async (ctx) => {
    // await botStart(ctx);
  });



bot.start();
