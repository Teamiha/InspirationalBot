import { getKv } from "./kvClient.ts";
import { taskList } from "./coreStaticInfo.ts";

interface TaskState {
  usedTasks: number[];
  currentTaskId: number | null;
}

export async function getTodayTask(): Promise<string> {
  const kv = await getKv();
  const state = await kv.get<TaskState>(["lenaBot", "tasks"]);

  const taskState: TaskState = state.value || {
    usedTasks: [],
    currentTaskId: null,
  };

  // Если все задания использованы, сбрасываем список
  if (taskState.usedTasks.length === taskList.length) {
    taskState.usedTasks = [];
  }

  // Получаем доступные задания
  const availableTasks = taskList.filter(
    (task) => !taskState.usedTasks.includes(task.id),
  );

  // Выбираем случайное задание
  const randomIndex = Math.floor(Math.random() * availableTasks.length);
  const selectedTask = availableTasks[randomIndex];

  // Обновляем состояние
  taskState.usedTasks.push(selectedTask.id);
  taskState.currentTaskId = selectedTask.id;

  // Сохраняем обновленное состояние
  await kv.set(["lenaBot", "tasks"], taskState);

  return selectedTask.text;
}

// export async function getCurrentTask(): Promise<string | null> {
//   const kv = await getKv();
//   const state = await kv.get<TaskState>(["lenaBot", "tasks"]);

//   if (!state.value || state.value.currentTaskId === null) {
//     return null;
//   }

//   const currentTaskId = state.value.currentTaskId;
//   const currentTask = taskList.find((task) => task.id === currentTaskId);

//   if (!currentTask) {
//     return null;
//   }

//   return currentTask.text;
// }
