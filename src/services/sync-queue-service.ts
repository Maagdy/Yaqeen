import { db, type SyncQueueItem } from "@/lib/db";

const MAX_RETRIES = 5;

export type SyncOperation =
  | "updateDailyProgress"
  | "addFavoriteReciter"
  | "removeFavoriteReciter"
  | "addFavoriteSurah"
  | "removeFavoriteSurah"
  | "addFavoriteAyah"
  | "removeFavoriteAyah"
  | "addFavoriteJuz"
  | "removeFavoriteJuz"
  | "addFavoriteBook"
  | "removeFavoriteBook"
  | "addFavoriteHadith"
  | "removeFavoriteHadith"
  | "addFavoriteMushaf"
  | "removeFavoriteMushaf"
  | "addFavoriteRadio"
  | "removeFavoriteRadio"
  | "addFavoriteDua"
  | "removeFavoriteDua"
  | "trackUserActivity";

export class SyncQueueService {
  static async enqueue(
    item: Omit<SyncQueueItem, "id" | "retries">,
  ): Promise<void> {
    await db.syncQueue.add({ ...item, retries: 0 });

    // Register background sync (best-effort, not all browsers support it)
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await (reg as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register("yaqeen-sync");
      } catch {
        // SyncManager not available — drain will happen via online event
      }
    }
  }

  static async drain(
    userId: string,
    executor: (item: SyncQueueItem) => Promise<void>,
  ): Promise<void> {
    const pending = await db.syncQueue
      .where("userId")
      .equals(userId)
      .sortBy("createdAt");

    for (const item of pending) {
      try {
        await executor(item);
        await db.syncQueue.delete(item.id!);
      } catch (error) {
        const newRetries = item.retries + 1;
        if (newRetries >= MAX_RETRIES) {
          // Discard permanently failing items
          await db.syncQueue.delete(item.id!);
          console.warn("[SyncQueue] Discarding item after max retries:", item.operationType);
        } else {
          await db.syncQueue.update(item.id!, { retries: newRetries });
        }
        console.error("[SyncQueue] Failed to replay operation:", item.operationType, error);
      }
    }
  }

  static async getPendingCount(userId: string): Promise<number> {
    return db.syncQueue.where("userId").equals(userId).count();
  }

  static async getPendingItems(userId: string): Promise<SyncQueueItem[]> {
    return db.syncQueue.where("userId").equals(userId).sortBy("createdAt");
  }
}
