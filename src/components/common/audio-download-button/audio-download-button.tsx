import { Download, CheckCircle, Trash2, Loader2 } from "lucide-react";
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
  const { isDownloaded, isDownloading, downloadProgress, download, remove } =
    useAudioDownload({ surahNumber, reciterId, audioUrl });

  if (isDownloading) {
    return (
      <button
        disabled
        className={`flex items-center gap-1.5 text-sm text-[var(--color-primary)] ${className}`}
        title="Downloading..."
        aria-label={`Downloading: ${downloadProgress}%`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{downloadProgress}%</span>
      </button>
    );
  }

  if (isDownloaded) {
    return (
      <button
        onClick={remove}
        className={`flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ${className}`}
        title="Downloaded — tap to remove"
        aria-label="Remove downloaded audio"
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
      title="Download for offline"
      aria-label="Download audio for offline listening"
    >
      <Download className="h-4 w-4" />
    </button>
  );
}
