import { getKv } from "./kvClient.ts";
import { wishesList } from "./coreStaticInfo.ts";

interface WishesState {
  usedWishes: number[];
  currentWishId: number | null;
}

export async function getTodayWish(): Promise<string> {
  const kv = await getKv();
  const state = await kv.get<WishesState>(["lenaBot", "wishes"]);

  const wishesState: WishesState = state.value || {
    usedWishes: [],
    currentWishId: null,
  };

  // Если все предсказания использованы, сбрасываем список
  if (wishesState.usedWishes.length === wishesList.length) {
    wishesState.usedWishes = [];
  }

  // Получаем доступные предсказания
  const availableWishes = wishesList.filter(
    (wish) => !wishesState.usedWishes.includes(wish.id),
  );

  // Выбираем случайное предсказание
  const randomIndex = Math.floor(Math.random() * availableWishes.length);
  const selectedWish = availableWishes[randomIndex];

  // Обновляем состояние
  wishesState.usedWishes.push(selectedWish.id);
  wishesState.currentWishId = selectedWish.id;

  // Сохраняем обновленное состояние
  await kv.set(["lenaBot", "wishes"], wishesState);

  return selectedWish.text;
}

// export async function getCurrentWish(): Promise<string | null> {
//   const kv = await getKv();
//   const state = await kv.get<WishesState>(["lenaBot", "wishes"]);

//   if (!state.value || state.value.currentWishId === null) {
//     return null;
//   }

//   const wish = wishesList.find((w) => w.id === state.value.currentWishId);
//   return wish ? wish.text : null;
// }
