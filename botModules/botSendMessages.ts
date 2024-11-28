import { Bot } from "@grammyjs/bot";


async function broadcastMessageWithImage(
  bot: Bot,
  userIds: number[],
  message: string,
  imageUrl: string
) {
  const batchSize = 30; // Отправляем по 30 сообщений за раз
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize); // Текущая группа из 30 пользователей

    for (const userId of batch) {
      try {
        await bot.api.sendPhoto(userId, imageUrl, {
          caption: message,
        });
        console.log(`Сообщение с изображением отправлено пользователю с ID: ${userId}`);
      } catch (error) {
        console.error(`Ошибка при отправке пользователю ${userId}:`, error.message);
      }
    }

    if (i + batchSize < userIds.length) {
      console.log(`Пауза после отправки ${i + batchSize} сообщений...`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Пауза в 1 секунду
    }
  }
}

// Пример использования
const userIds = [123456789, 987654321, 1122334455]; // Замени на реальные ID пользователей
const message = "Привет! Вот картинка, которую мы хотим показать!";
const imageUrl = "https://example.com/path/to/image.jpg"; // Ссылка на изображение

bot.command("send", async (ctx) => {
  await broadcastMessageWithImage(bot, userIds, message, imageUrl);
  await ctx.reply("Рассылка с изображением завершена!");
});

bot.start();