import { client } from "../client";
import { MP3QURAN_BASE_URL, ENDPOINTS } from "../endpoints";
import type { Surah, Mp3QuranSurahResponse } from "./queries.types";
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
