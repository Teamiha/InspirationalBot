import { Bot } from "@grammyjs/bot";
import { getMailingList } from "../db.ts";
import { getTodayTask } from "../botStatic/taskManager.ts";
import { getTodayImage } from "../botStatic/imageManager.ts";
import { getTodayWish } from "../botStatic/wishesManager.ts";

async function broadcastMessageWithImage(
  bot: Bot,
  userIds: number[],
  message: string,
  imageUrl: string,
) {
  const batchSize = 30; // Отправляем по 30 сообщений за раз
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize); // Текущая группа из 30 пользователей

    for (const userId of batch) {
      try {
        await bot.api.sendPhoto(userId, imageUrl, {
          caption: message,
        });
        console.log(
          `Сообщение с изображением отправлено пользователю с ID: ${userId}`,
        );
      } catch (error) {
        console.error(
          `Ошибка при отправке пользователю ${userId}:`,
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }

    if (i + batchSize < userIds.length) {
      console.log(`Пауза после отправки ${i + batchSize} сообщений...`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Пауза в 1 секунду
    }
  }
}
