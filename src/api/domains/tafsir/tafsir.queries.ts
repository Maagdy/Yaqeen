import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type { AyahTafsir, TafsirBook, TafsirResponse } from "./tafsir.types";

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
