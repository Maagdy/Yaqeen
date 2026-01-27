import type { Ayah, Surah } from "../../../api/queries/queries.types";

export interface SurahDetailsProps {
  surah: Surah;
  ayahs: Ayah[];
  language: string;
}
