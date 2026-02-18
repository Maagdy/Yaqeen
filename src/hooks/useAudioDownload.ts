import { useState, useEffect, useCallback } from "react";
import { AudioStorageService } from "@/services/audio-storage-service";

interface UseAudioDownloadOptions {
  surahNumber: number;
  reciterId: string;
  audioUrl: string;
}

interface UseAudioDownloadResult {
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  download: () => Promise<void>;
  remove: () => Promise<void>;
  storageStats: { usedBytes: number; availableBytes: number } | null;
}

export function useAudioDownload({
  surahNumber,
  reciterId,
  audioUrl,
}: UseAudioDownloadOptions): UseAudioDownloadResult {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [storageStats, setStorageStats] = useState<{ usedBytes: number; availableBytes: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    AudioStorageService.isDownloaded(surahNumber, reciterId).then((result) => {
      if (mounted) setIsDownloaded(result);
    });
    return () => { mounted = false; };
  }, [surahNumber, reciterId]);

  const download = useCallback(async () => {
    if (isDownloading || isDownloaded) return;

    const stats = await AudioStorageService.getStorageStats();
    setStorageStats(stats);

    if (stats.availableBytes < 100 * 1024 * 1024) {
      const confirmed = window.confirm(
        `Low storage: only ${Math.round(stats.availableBytes / 1024 / 1024)}MB available. Download anyway?`,
      );
      if (!confirmed) return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      await AudioStorageService.downloadSurah(
        surahNumber,
        reciterId,
        audioUrl,
        (percent) => setDownloadProgress(percent),
      );
      setIsDownloaded(true);
      setDownloadProgress(100);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, isDownloaded, surahNumber, reciterId, audioUrl]);

  const remove = useCallback(async () => {
    await AudioStorageService.deleteDownload(surahNumber, reciterId);
    setIsDownloaded(false);
    setDownloadProgress(0);
  }, [surahNumber, reciterId]);

  return { isDownloaded, isDownloading, downloadProgress, download, remove, storageStats };
}
