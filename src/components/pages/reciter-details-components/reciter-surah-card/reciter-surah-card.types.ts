import type { Reciter } from "@/api/domains/reciters/reciters.types";

export interface ReciterSurahCardProps {
  number: number;
  name: string;
  arabicName?: string;
  onPlay: () => void;
  isPlaying?: boolean;
  onDownload: () => void;
  onCopyLink?: () => void;
  reciter: Reciter | undefined;
}
