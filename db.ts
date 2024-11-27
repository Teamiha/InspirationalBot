import { getKv } from "./botStatic/kvClient.ts";
import { getDate } from "./helper.ts";
export interface UserData {
    name: string;
    status: boolean;
    dateStartSubscription: string;
    dateEndSubscription: string;
  }

  export async function addUser(userId: number, userName: string) {
    const kv = await getKv();

    const newUser: UserData = {
        name: userName,
        status: false,
        dateStartSubscription: await getDate(),
        dateEndSubscription: "",
    };

    await kv.set(["lenaBot", "userId:", userId], newUser);
  }


  export async function getUser(userId: number) {
    const kv = await getKv();

    const user = await kv.get<UserData>(["lenaBot", "userId:", userId]);
   
    return user;
  }

  export async function getUserParametr<Key extends keyof UserData>(
    userId: number,
    parametr: Key,
  ) {
    const user = await getUser(userId);
    return (user.value as UserData)[parametr];
  }

  
  