import { db } from "@/lib/db";

const AUDIO_CACHE_NAME = "yaqeen-audio-v1";

export class AudioStorageService {
  static async downloadSurah(
    surahNumber: number,
    reciterId: string,
    audioUrl: string,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    const cacheKey = audioUrl;
    const cache = await caches.open(AUDIO_CACHE_NAME);

    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body!.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total > 0 && onProgress) {
        onProgress(Math.round((loaded / total) * 100));
      }
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });
    const cacheResponse = new Response(blob, {
      headers: { "Content-Type": "audio/mpeg", "Content-Length": String(blob.size) },
    });

    await cache.put(cacheKey, cacheResponse);

    // Write metadata to IndexedDB
    await db.audioDownloads
      .where("[surahNumber+reciterId]")
      .equals([surahNumber, reciterId])
      .delete();

    await db.audioDownloads.add({
      surahNumber,
      reciterId,
      audioUrl,
      cacheKey,
      fileSizeBytes: blob.size,
      downloadedAt: new Date().toISOString(),
    });
  }

  static async getLocalAudio(audioUrl: string): Promise<Blob | null> {
    try {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const response = await cache.match(audioUrl);
      if (!response) return null;
      return response.blob();
    } catch {
      return null;
    }
  }

  static async deleteDownload(
    surahNumber: number,
    reciterId: string,
  ): Promise<void> {
    const meta = await db.audioDownloads
      .where("[surahNumber+reciterId]")
      .equals([surahNumber, reciterId])
      .first();

    if (meta) {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      await cache.delete(meta.cacheKey);
      await db.audioDownloads.delete(meta.id!);
    }
  }

  static async isDownloaded(
    surahNumber: number,
    reciterId: string,
  ): Promise<boolean> {
    const meta = await db.audioDownloads
      .where("[surahNumber+reciterId]")
      .equals([surahNumber, reciterId])
      .first();

    if (!meta) return false;

    // Verify cache still has the file (iOS may evict it)
    try {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const response = await cache.match(meta.cacheKey);
      return response !== undefined;
    } catch {
      return false;
    }
  }

  static async getStorageStats(): Promise<{ usedBytes: number; availableBytes: number }> {
    let usedBytes = 0;
    const downloads = await db.audioDownloads.toArray();
    for (const d of downloads) {
      usedBytes += d.fileSizeBytes;
    }

    let availableBytes = 50 * 1024 * 1024; // 50MB fallback
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      availableBytes = (estimate.quota ?? 0) - (estimate.usage ?? 0);
    }

    return { usedBytes, availableBytes };
  }
}
