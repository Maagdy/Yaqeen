import Dexie, { type Table } from "dexie";

export interface SyncQueueItem {
  id?: number;
  operationType: string;
  payload: unknown;
  activityTimestamp: string; // ISO — the real time of the activity
  userId: string;
  createdAt: string;
  retries: number;
}

export interface AudioDownloadMeta {
  id?: number;
  surahNumber: number;
  reciterId: string;
  audioUrl: string;
  cacheKey: string;
  fileSizeBytes: number;
  downloadedAt: string;
}

export interface PrayerTimesLocalCache {
  id?: number;
  locationKey: string; // `${city}-${country}` or `${lat}-${lon}`
  data: unknown;
  cachedAt: string;
  forDate: string; // YYYY-MM-DD
}

class YaqeenDB extends Dexie {
  syncQueue!: Table<SyncQueueItem>;
  audioDownloads!: Table<AudioDownloadMeta>;
  prayerTimesCache!: Table<PrayerTimesLocalCache>;

  constructor() {
    super("YaqeenDB");
    this.version(1).stores({
      syncQueue: "++id, userId, operationType, createdAt",
      audioDownloads: "++id, [surahNumber+reciterId], surahNumber",
      prayerTimesCache: "++id, [locationKey+forDate], locationKey",
    });
  }
}

export const db = new YaqeenDB();
