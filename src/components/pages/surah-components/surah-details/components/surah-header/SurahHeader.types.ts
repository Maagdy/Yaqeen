import type { Surah } from "@/api";
import type { SurahData } from "@/api";

export interface SurahHeaderProps {
  surah: Surah | SurahData;
  isRtl: boolean;
  language: string;
  fullSurahAudioUrl?: string;
  isFullSurahPlaying: boolean;
  onFullSurahClick: () => void;
}
