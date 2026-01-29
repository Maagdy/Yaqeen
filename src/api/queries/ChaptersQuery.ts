import { client } from "../client";
import { MP3QURAN_BASE_URL, ALQURAN_BASE_URL, ENDPOINTS } from "../endpoints";
import type {
  Surah,
  Mp3QuranSurahResponse,
  SurahResponse,
  SurahData,
} from "./queries.types";
import { mapMp3QuranSurahToSurah as mapSurah } from "./queries.types";

export const getChapters = async (): Promise<Surah[]> => {
  // Fetch both English and Arabic versions from mp3quran API
  const [englishData, arabicData] = await Promise.all([
    client.get<Mp3QuranSurahResponse>(
      `${MP3QURAN_BASE_URL}${ENDPOINTS.MP3QURAN_SUWAR("eng")}`,
    ),
    client.get<Mp3QuranSurahResponse>(
      `${MP3QURAN_BASE_URL}${ENDPOINTS.MP3QURAN_SUWAR("ar")}`,
    ),
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
  // Build the endpoint URL based on whether offset/limit are provided
  const endpoint =
    offset !== undefined && limit !== undefined
      ? ENDPOINTS.SURAH_WITH_OFFSET(surahNumber, offset, limit, edition)
      : ENDPOINTS.SURAH(surahNumber, edition);

  const response = await client.get<SurahResponse>(
    `${ALQURAN_BASE_URL}${endpoint}`,
  );

  return response.data;
};

export const getSurahMultipleEditions = async (
  surahNumber: number,
  editions: string[],
): Promise<SurahData[]> => {
  const endpoint = `/surah/${surahNumber}/editions/${editions.join(",")}`;

  const response = await client.get<{
    code: number;
    status: string;
    data: SurahData[];
  }>(`${ALQURAN_BASE_URL}${endpoint}`);

  return response.data;
};
