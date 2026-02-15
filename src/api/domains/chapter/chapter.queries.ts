import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type {
  Mp3QuranSurahResponse,
  Surah,
  SurahData,
  SurahResponse,
} from "./chapter.types";
import { mapMp3QuranSurahToSurah as mapSurah } from "./chapter.types";

export const getChapters = async (): Promise<Surah[]> => {
  // Fetch both English and Arabic versions from mp3quran API
  const [arabicData, englishData] = await Promise.all([
    client.get<Mp3QuranSurahResponse>(ENDPOINTS.MP3QURAN_SUWAR("ar")),
    client.get<Mp3QuranSurahResponse>(ENDPOINTS.MP3QURAN_SUWAR("eng")),
  ]);

  // Merge Arabic names into English data
  const mergedSuwar = englishData.suwar.map((engSurah, index) => ({
    ...engSurah,
    arabicName: arabicData.suwar[index]?.name,
  }));

  // Map mp3quran response to our Surah format
  return mergedSuwar.map(mapSurah);
};

export const getSurah = async (
  surahNumber: number,
  edition: string = "quran-uthmani",
  offset?: number,
  limit?: number,
): Promise<SurahData> => {
  // Use the appropriate endpoint based on whether offset/limit are provided
  const endpoint =
    offset !== undefined && limit !== undefined
      ? ENDPOINTS.SURAH_WITH_OFFSET(surahNumber, offset, limit, edition)
      : ENDPOINTS.SURAH(surahNumber, edition);

  const response = await client.get<SurahResponse>(endpoint);

  return response.data;
};

export const getSurahMultipleEditions = async (
  surahNumber: number,
  editions: string[],
): Promise<SurahData[]> => {
  const endpoint = ENDPOINTS.AYAH_MANY_EDITIONS(surahNumber, editions);

  const response = await client.get<{
    code: number;
    status: string;
    data: SurahData[];
  }>(endpoint);

  return response.data;
};
