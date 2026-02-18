import { useCallback } from "react";
import { Download, CheckCircle, Trash2, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAudioDownload } from "@/hooks/useAudioDownload";

interface AudioDownloadButtonProps {
  surahNumber: number;
  reciterId: string;
  audioUrl: string;
  className?: string;
}

export function AudioDownloadButton({
  surahNumber,
  reciterId,
  audioUrl,
  className = "",
}: AudioDownloadButtonProps) {
  const { t } = useTranslation();
  const confirmLowStorage = useCallback(
    (mb: number) => window.confirm(t("pwa.low_storage_message", { mb })),
    [t],
  );
  const { isDownloaded, isDownloading, downloadProgress, download, remove, cancel } =
    useAudioDownload({
      surahNumber,
      reciterId,
      audioUrl,
      onConfirmLowStorage: confirmLowStorage,
    });

  if (isDownloading) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          disabled
          className="flex items-center gap-1.5 text-sm text-[var(--color-primary)]"
          title={t("pwa.downloading")}
          aria-label={t("pwa.download_progress", { percent: downloadProgress })}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{downloadProgress}%</span>
        </button>
        <button
          onClick={cancel}
          className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
          title={t("pwa.cancel_download")}
          aria-label={t("pwa.cancel_download")}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (isDownloaded) {
    return (
      <button
        onClick={remove}
        className={`flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ${className}`}
        title={t("pwa.downloaded_remove")}
        aria-label={t("pwa.remove_download")}
      >
        <CheckCircle className="h-4 w-4" />
        <Trash2 className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <button
      onClick={download}
      className={`flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors ${className}`}
      title={t("pwa.download_offline")}
      aria-label={t("pwa.download_audio_offline")}
    >
      <Download className="h-4 w-4" />
    </button>
  );
}
