import type { Surah } from "@/api";

export interface JuzCardProps {
  juzNumber: number;
  surahs: Surah[];
  onClick?: () => void;
}
