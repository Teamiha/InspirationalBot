import { InlineKeyboard } from "@grammyjs/bot";

export const startKeyboard = new InlineKeyboard()
  .text("Отписаться от рассылки", "unsubscribe")
  .row()
  .text("Информация о боте", "info");

export const adminKeyboard = new InlineKeyboard()
  .text("Список активных подписчиков", "subscribersList")
  .row()
  .text("Перейти в режим обычного пользователя", "userMode");

export const registrationKeyboard = new InlineKeyboard()
  .text("Подписаться на рассылку", "subscribe")
  .row()
  .text("Информация о боте", "info");
