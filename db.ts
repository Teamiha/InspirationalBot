import { getKv } from "./botStatic/kvClient.ts";
import { getDate } from "./helper.ts";
export interface UserData {
  name: string;
  status: boolean;
  dateStartSubscription: string;
  dateEndSubscription: string;
}

export async function addUser(userId: number) {
  const kv = await getKv();

  const newUser: UserData = {
    name: "",
    status: false,
    dateStartSubscription: await getDate(),
    dateEndSubscription: "",
  };

  await kv.set(["lenaBot", "user", userId], newUser);
}

export async function getUser(userId: number) {
  const kv = await getKv();

  const user = await kv.get<UserData>(["lenaBot", "user", userId]);

  if (!user.value) {
    await addUser(userId);
    const newUserData = await kv.get(["lenaBot", "user", userId]);
    console.log("new user");

    return newUserData;
  }

  return user;
}

export async function getUserParametr<Key extends keyof UserData>(
  userId: number,
  parametr: Key,
) {
  const user = await getUser(userId);
  return (user.value as UserData)[parametr];
}

export async function updateUser<Key extends keyof UserData>(
  userId: number,
  dataUpdate: Key,
  valueUpdate: UserData[Key],
) {
  const kv = await getKv();
  const currentData = await kv.get<UserData>(["lenaBot", "user", userId]);
  if (
    currentData && currentData.value && `${dataUpdate}` in currentData.value
  ) {
    currentData.value[dataUpdate] = valueUpdate;
    await kv.set(["lenaBot", "user", userId], currentData.value);
  } else {
    console.log("Запись не найдена");
  }
}

async function addUserToSubscribers(userId: number) {
  const kv = await getKv();

  const result = await kv.get<number[]>(["lenaBot", "subscribers"]);
  const subscribersList = result.value || [];

  if (!subscribersList.includes(userId)) {
    subscribersList.push(userId);
    await kv.set(["lenaBot", "subscribers"], subscribersList);
  }
}

async function deleteUserFromSubscribers(userId: number) {
  const kv = await getKv();

  const result = await kv.get<number[]>(["lenaBot", "subscribers"]);
  const subscribersList = result.value || [];

  const updatedList = subscribersList.filter((id) => id !== userId);

  await kv.set(["lenaBot", "subscribers"], updatedList);
}

export async function getMailingList(): Promise<number[]> {
  const kv = await getKv();
  const subscribers = await kv.get<number[]>(["lenaBot", "subscribers"]);
  return subscribers.value || [];
}

export async function getListActiveSubscribers(): Promise<string> {
  const kv = await getKv();
  const subscribers = await kv.get<number[]>(["lenaBot", "subscribers"]);
  const subscribersList = subscribers.value || [];

  let result = "";

  for (const userId of subscribersList) {
    const userData = await getUser(userId);
    if (userData.value) {
      const user = userData.value as UserData;
      result += `${userId}, ${user.name}, ${user.dateStartSubscription}\n`;
    }
  }

  return result || "Нет активных подписчиков";
}

export async function activateSubscription(userId: number) {
  await updateUser(userId, "status", true);
  await updateUser(userId, "dateStartSubscription", await getDate());

  await addUserToSubscribers(userId);
}

export async function deactivateSubscription(userId: number) {
  await updateUser(userId, "status", false);
  await updateUser(userId, "dateEndSubscription", await getDate());

  await deleteUserFromSubscribers(userId);
}
