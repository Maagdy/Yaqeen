import type { Surah } from "@/api";
import type { SurahData } from "@/api";
import type { ReciterOption } from "@/hooks/useReciterSelector";

export interface SurahHeaderProps {
  surah: Surah | SurahData;
  isRtl: boolean;
  language: string;
  fullSurahAudioUrl?: string;
  isFullSurahPlaying: boolean;
  onFullSurahClick: () => void;
  isJuzPage?: boolean;
  availableReciters?: ReciterOption[];
  selectedReciter?: ReciterOption | null;
  onReciterChange?: (reciterId: number) => void;
  isRecitersLoading?: boolean;
}
