import type { MushafSurah } from "@/api/domains/mushafs/mushafs.types";

export interface MushafSurahCardProps {
  surah: MushafSurah;
  onClick?: () => void;
}
