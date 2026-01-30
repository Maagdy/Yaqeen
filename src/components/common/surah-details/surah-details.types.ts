import type {
  Ayah,
  Surah,
  SurahData,
} from "../../../api/queries/queries.types";

export interface SurahDetailsProps {
  surah: Surah | SurahData;
  ayahs: Ayah[];
}
