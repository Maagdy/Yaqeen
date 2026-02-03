import type { Ayah, Surah, SurahData } from "../../../api";

export interface SurahDetailsProps {
  surah: Surah | SurahData;
  ayahs: Ayah[];
  onAyahClick?: (ayah: Ayah) => void;
}
