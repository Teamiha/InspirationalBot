import { InlineKeyboard } from "@grammyjs/bot";


export const startKeyboard = new InlineKeyboard()
  .text("Процесс обустройки замка", "castleProcess")
  .row()
  .text("Информация", "info")
  .row()
  .text("Анонимное сообщение", "anonMessage")
  .row()
  // .text("Добавить вещь в глобальный виш-лист", "addWish")
  // .row()
  .text("Админский раздел", "adminZone");