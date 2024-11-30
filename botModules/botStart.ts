import { getUserParametr, updateUser } from "../db.ts";
import { Context } from "@grammyjs/bot";
import { SUPERUSER } from "../config.ts";
import {
  adminKeyboard,
  registrationKeyboard,
  startKeyboard,
} from "../botStatic/keyboard.ts";

export async function botStart(ctx: Context) {
  const userId = ctx.from?.id;
  const userName = ctx.from?.username;

  if (userId && userName) {
    if (await getUserParametr(userId, "name") === "") {
      await updateUser(userId, "name", userName);
    }

    const userHasSubscription = await getUserParametr(userId, "status");

    if (userId === Number(SUPERUSER)) {
      await ctx.reply("Добро пожаловать, госпожа!", {
        reply_markup: adminKeyboard,
      });
      return;
    }

    if (userHasSubscription === false) {
      await ctx.reply("Добро пожаловать! Желаете подписаться на рассылку?", {
        reply_markup: registrationKeyboard,
      });
      return;
    }

    if (userHasSubscription === true) {
      await ctx.reply("Добро пожаловать!", {
        reply_markup: startKeyboard,
      });
      return;
    }
  }
}
