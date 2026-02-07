import { useQuery } from "@tanstack/react-query";
import type {
  AyahTafsir,
  TafsirBook,
  TafsirResponse,
  HadithParams,
  HadithResponse,
  HadithCollection,
} from "./tafsir.types";
import {
  getAyahTafsir,
  getSurahTafsir,
  getTafsirBooks,
  getHadiths,
  getHadithCollections,
} from "./tafsir.queries";

export const useTafsirBooks = () => {
  return useQuery<TafsirBook[]>({
    queryKey: ["tafsir-books"] as const,
    queryFn: getTafsirBooks,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useSurahTafsir = (
  tafsirId: number,
  suraId: number,
  language?: string,
) => {
  return useQuery<TafsirResponse>({
    queryKey: ["surah-tafsir", tafsirId, suraId, language],
    queryFn: () => getSurahTafsir(tafsirId, suraId, language),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: Boolean(tafsirId) && Boolean(suraId),
  });
};

export const useAyahTafsir = (
  tafsirId: number,
  suraNumber: number,
  ayahNumber: number,
) => {
  return useQuery<AyahTafsir>({
    queryKey: ["ayah-tafsir", tafsirId, suraNumber, ayahNumber],
    queryFn: () => getAyahTafsir(tafsirId, suraNumber, ayahNumber),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: Boolean(tafsirId) && Boolean(suraNumber) && Boolean(ayahNumber),
  });
};

export const useHadiths = (params?: HadithParams) => {
  return useQuery<HadithResponse>({
    queryKey: ["hadiths", params],
    queryFn: () => getHadiths(params),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: Boolean(params), // Only fetch if params are provided
  });
};

export const useHadithCollections = (exclusions?: string[]) => {
  return useQuery<HadithCollection[]>({
    queryKey: ["hadith-collections", exclusions],
    queryFn: () => getHadithCollections(exclusions),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - collections don't change often
  });
};
