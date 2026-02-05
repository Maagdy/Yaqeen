import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import { quranSurahs } from "../../../utils/constants";
import type {
  FullMushaf,
  FullMushafWithSurahs,
  MushafAyah,
  MushafMetadata,
  MushafSurah,
} from "./mushafs.types";

export const getAllMushafs = async (): Promise<FullMushaf[]> => {
  return client.get<FullMushaf[]>(ENDPOINTS.MUSHAFS);
};

export const getFullMushaf = async (
  mushafId: number,
): Promise<FullMushafWithSurahs> => {
  return client.get<FullMushafWithSurahs>(ENDPOINTS.SINGLE_MUSHAF(mushafId));
};

// Get mushaf metadata only (lightweight)
// We fetch ALL mushafs (lightweight list) and find the one we need
// instead of fetching the HUGE single mushaf endpoint
export const getMushafMetadata = async (
  mushafId: number,
): Promise<MushafMetadata> => {
  const allMushafs = await getAllMushafs();
  const mushaf = allMushafs.find((m) => m.id === mushafId);

  if (!mushaf) {
    throw new Error(`Mushaf with ID ${mushafId} not found`);
  }

  return {
    id: mushaf.id,
    name: mushaf.name,
    description: mushaf.description,
    image: mushaf.image,
    bismillah: mushaf.bismillah,
    font_file: mushaf.font_file,
    images: mushaf.images,
    rawi: mushaf.rawi,
    totalSurahs: 114, // Quran has 114 surahs
  };
};

// Get specific surah from mushaf
export const getMushafSurah = async (
  mushafId: number,
  surahNumber: number,
): Promise<MushafSurah> => {
  // API returns only an array of ayahs for the specific surah
  const ayahs = await client.get<MushafAyah[]>(
    ENDPOINTS.MUSHAF_SURAH(mushafId, surahNumber),
  );

  // We need to construct the MushafSurah object using constants
  const surahInfo = quranSurahs.find((s) => s.number === surahNumber);

  return {
    id: surahNumber,
    name: surahInfo?.arabicName || `Surah ${surahNumber}`,
    coded_name: surahInfo?.name || "",
    ayahs: ayahs,
  };
};

// Get range of surahs (for pagination)
export const getMushafSurahs = async (
  mushafId: number,
  startSurah: number,
  endSurah: number,
): Promise<MushafSurah[]> => {
  const promises = [];
  for (let i = startSurah; i <= endSurah; i++) {
    promises.push(getMushafSurah(mushafId, i));
  }
  return Promise.all(promises);
};
