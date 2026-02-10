import type { Reciter } from "@/api/domains/reciters/reciters.types";

export interface ReciterSurahsListProps {
  surahList: string[];
  isPlaying: boolean;
  currentSurahNumber: number | null;
  language: string;
  onPlay: (surahNumber: number) => void;
  onDownload: (surahNumber: number) => Promise<void>;
  onCopyLink: (surahNumber: number) => void;
  reciter: Reciter | undefined;
}
