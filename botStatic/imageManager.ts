import { getKv } from "./kvClient.ts";
import imageLinks from "./imageLink.ts";

interface ImageState {
  usedImages: number[];
  currentImageId: number | null;
}

export async function getTodayImage(): Promise<string> {
  const kv = await getKv();
  const state = await kv.get<ImageState>(["lenaBot", "images"]);

  let imageState: ImageState = state.value || {
    usedImages: [],
    currentImageId: null,
  };

  // Если все изображения использованы, сбрасываем список
  if (imageState.usedImages.length === imageLinks.length) {
    imageState.usedImages = [];
  }

  // Получаем доступные изображения
  const availableImages = imageLinks.filter(
    (image) => !imageState.usedImages.includes(image.id),
  );

  // Выбираем случайное изображение
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // Обновляем состояние
  imageState.usedImages.push(selectedImage.id);
  imageState.currentImageId = selectedImage.id;

  // Сохраняем обновленное состояние
  await kv.set(["lenaBot", "images"], imageState);

  return selectedImage.url;
}

export async function getCurrentImage(): Promise<string | null> {
  const kv = await getKv();
  const state = await kv.get<ImageState>(["lenaBot", "images"]);

  if (!state.value || state.value.currentImageId === null) {
    return null;
  }

  const image = imageLinks.find((img) => img.id === state.value.currentImageId);
  return image ? image.url : null;
}
