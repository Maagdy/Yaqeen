import { useQuery } from "@tanstack/react-query";
import {
  getAllMushafs,
  getFullMushaf,
  getMushafMetadata,
  getMushafSurah,
  getMushafSurahs,
} from "./mushafs.queries";
import type {
  FullMushaf,
  FullMushafWithSurahs,
  MushafMetadata,
  MushafSurah,
} from "./mushafs.types";

export const useAllMushafs = () => {
  return useQuery<FullMushaf[]>({
    queryKey: ["mushafs"],
    queryFn: getAllMushafs,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useFullMushaf = (mushafId: number) => {
  return useQuery<FullMushafWithSurahs>({
    queryKey: ["mushaf", mushafId],
    queryFn: () => getFullMushaf(mushafId),
    enabled: Boolean(mushafId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Get mushaf metadata only (lightweight)
export const useMushafMetadata = (mushafId: number) => {
  return useQuery<MushafMetadata>({
    queryKey: ["mushaf-metadata", mushafId],
    queryFn: () => getMushafMetadata(mushafId),
    enabled: Boolean(mushafId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Get specific surah from mushaf
export const useMushafSurah = (mushafId: number, surahNumber: number) => {
  return useQuery<MushafSurah>({
    queryKey: ["mushaf-surah", mushafId, surahNumber],
    queryFn: () => getMushafSurah(mushafId, surahNumber),
    enabled: Boolean(mushafId) && Boolean(surahNumber),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Get range of surahs (for pagination)
export const useMushafSurahs = (
  mushafId: number,
  startSurah: number,
  endSurah: number,
) => {
  return useQuery<MushafSurah[]>({
    queryKey: ["mushaf-surahs", mushafId, startSurah, endSurah],
    queryFn: () => getMushafSurahs(mushafId, startSurah, endSurah),
    enabled: Boolean(mushafId) && startSurah > 0 && endSurah >= startSurah,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
