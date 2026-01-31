import type { Surah, SurahData } from "../../api";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type SurahPageProps = {};

export interface SurahLoaderData {
  chapters: Surah[];
  surah: SurahData;
  surahNumber: number;
  edition: string;
}
