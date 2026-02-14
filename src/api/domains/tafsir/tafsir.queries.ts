import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
const API_KEY = import.meta.env.VITE_SUNNAH_API_KEY;
import type {
  AyahTafsir,
  TafsirBook,
  TafsirResponse,
  HadithParams,
  HadithListResponse,
  HadithCollectionResponse,
  HadithCollection,
  HadithBook,
  HadithBookResponse,
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
): Promise<HadithListResponse> {
  try {
    // Use the new endpoint constants
    const url =
      params?.collection && params?.book
        ? ENDPOINTS.HADITHS_BY_BOOK(params.collection, params.book)
        : ENDPOINTS.HADITHS;

    const { data } = await axios.get<HadithListResponse>(url, {
      headers: {
        Accept: "application/json",
        "X-API-Key": API_KEY,
      },
      params: {
        page: params?.page,
        limit: params?.limit,
        // Only include these if not using the specific endpoint
        ...(!params?.collection || !params?.book
          ? {
              collection: params?.collection,
              book: params?.book,
              hadithNumber: params?.hadithNumber,
            }
          : {}),
      },
    });

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
    const { data } = await axios.get<HadithCollectionResponse>(
      ENDPOINTS.HADITH_COLLECTIONS,
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

export async function getCollectionBooks(
  collectionName: string,
): Promise<HadithBook[]> {
  try {
    const { data } = await axios.get<HadithBookResponse>(
      ENDPOINTS.HADITH_COLLECTION_BOOKS(collectionName),
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": API_KEY,
        },
      },
    );

    return data.data;
  } catch (error) {
    console.error("Failed to fetch collection books:", error);
    throw error;
  }
}
