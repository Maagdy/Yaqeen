import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
const API_KEY = import.meta.env.VITE_SUNNAH_API_KEY;
import type {
  AyahTafsir,
  TafsirBook,
  TafsirResponse,
  HadithParams,
  HadithResponse,
  HadithCollection,
} from "./tafsir.types";
import axios from "axios";

export const getTafsirBooks = async (): Promise<TafsirBook[]> => {
  return client.get<TafsirBook[]>(ENDPOINTS.ALL_TAFSIR_BOOKS);
};

export const getSurahTafsir = async (
  tafsirId: number,
  suraId: number,
  language?: string,
): Promise<TafsirResponse> => {
  return client.get<TafsirResponse>(
    ENDPOINTS.TAFSIR(tafsirId, suraId, language),
  );
};

export const getAyahTafsir = async (
  tafsirId: number,
  suraNumber: number,
  ayahNumber: number,
): Promise<AyahTafsir> => {
  return client.get<AyahTafsir>(
    ENDPOINTS.ONE_AYAH_TAFSIR(tafsirId, suraNumber, ayahNumber),
  );
};

export async function getHadiths(
  params?: HadithParams,
): Promise<HadithResponse> {
  try {
    const { data } = await axios.get<HadithResponse>(
      "https://api.sunnah.com/v1/hadiths",
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": API_KEY,
        },
        params,
      },
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch hadiths:", error);
    throw error;
  }
}

export async function getHadithCollections(
  exclusions: string[] = ["darimi", "nawawi40", "malik"],
): Promise<HadithCollection[]> {
  try {
    const { data } = await axios.get<HadithResponse>(
      "/api/proxy?url=https://api.sunnah.com/v1/collections",
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": API_KEY,
        },
      },
    );

    // Filter out excluded collections
    const filteredCollections = data.data.filter(
      (collection) => !exclusions.includes(collection.name),
    );

    return filteredCollections;
  } catch (error) {
    console.error("Failed to fetch hadith collections:", error);
    throw error;
  }
}
