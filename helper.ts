import { getUser } from "./db.ts";
import { getKv } from "./botStatic/kvClient.ts";
import { UserData } from "./db.ts";



export function getDate() {
  const now = new Date();

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = now.toLocaleDateString("en-US", dateOptions);
  const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

  const result = `${formattedDate} ${formattedTime}`;

  return result;
}


export async function syncSubscribersList() {
    const kv = await getKv();
    const subscribers = await kv.get<number[]>(["lenaBot", "subscribers"]);
    const subscribersList = subscribers.value || [];
    
    // Создаём новый список только из пользователей с активным статусом
    const actualSubscribers: number[] = [];
    
    for (const userId of subscribersList) {
      const userData = await getUser(userId);
      if ((userData.value as UserData)?.status === true) {
        actualSubscribers.push(userId);
      }
    }
    
    // Обновляем список подписчиков
    await kv.set(["lenaBot", "subscribers"], actualSubscribers);
  }