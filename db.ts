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

  await kv.set(["lenaBot", "userId:", userId], newUser);
}

export async function getUser(userId: number) {
  const kv = await getKv();

  const user = await kv.get<UserData>(["lenaBot", "userId:", userId]);

  if (!user.value) {
    await addUser(userId);
    const newUserData = await kv.get(["lenaBot", "userId:", userId]);
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
  const kv = await Deno.openKv();
  const currentData = await kv.get<UserData>(["lenaBot", "userId:", userId]);
  if (
    currentData && currentData.value && `${dataUpdate}` in currentData.value
  ) {
    currentData.value[dataUpdate] = valueUpdate;
    await kv.set(["lenaBot", "userId:", userId], currentData.value);
  } else {
    console.log("Запись не найдена");
  }
  await kv.close();
}


