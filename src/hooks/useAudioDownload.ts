import { useState, useEffect, useCallback, useRef } from "react";
import { AudioStorageService } from "@/services/audio-storage-service";

interface UseAudioDownloadOptions {
  surahNumber: number;
  reciterId: string;
  audioUrl: string;
  /** Called when storage is low (<100MB). Return true to proceed, false to cancel. */
  onConfirmLowStorage?: (availableMB: number) => boolean | Promise<boolean>;
}

interface UseAudioDownloadResult {
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  download: () => Promise<void>;
  remove: () => Promise<void>;
  cancel: () => void;
  storageStats: { usedBytes: number; availableBytes: number } | null;
}

export function useAudioDownload({
  surahNumber,
  reciterId,
  audioUrl,
  onConfirmLowStorage,
}: UseAudioDownloadOptions): UseAudioDownloadResult {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [storageStats, setStorageStats] = useState<{ usedBytes: number; availableBytes: number } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;
    AudioStorageService.isDownloaded(surahNumber, reciterId).then((result) => {
      if (mounted) setIsDownloaded(result);
    });
    return () => { mounted = false; };
  }, [surahNumber, reciterId]);

  const download = useCallback(async () => {
    if (isDownloading || isDownloaded) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const stats = await AudioStorageService.getStorageStats();
      setStorageStats(stats);

      if (stats.availableBytes < 100 * 1024 * 1024 && onConfirmLowStorage) {
        const proceed = await onConfirmLowStorage(Math.round(stats.availableBytes / 1024 / 1024));
        if (!proceed) {
          setIsDownloading(false);
          abortControllerRef.current = null;
          return;
        }
      }

      await AudioStorageService.downloadSurah(
        surahNumber,
        reciterId,
        audioUrl,
        (percent) => setDownloadProgress(percent),
        controller.signal,
      );
      setIsDownloaded(true);
      setDownloadProgress(100);
    } catch (error) {
      setDownloadProgress(0);
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("[AudioDownload] Download failed:", error);
      }
    } finally {
      abortControllerRef.current = null;
      setIsDownloading(false);
    }
  }, [isDownloading, isDownloaded, surahNumber, reciterId, audioUrl, onConfirmLowStorage]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const remove = useCallback(async () => {
    await AudioStorageService.deleteDownload(surahNumber, reciterId);
    setIsDownloaded(false);
    setDownloadProgress(0);
  }, [surahNumber, reciterId]);

  return { isDownloaded, isDownloading, downloadProgress, download, remove, cancel, storageStats };
}
