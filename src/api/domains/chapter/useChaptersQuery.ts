import { useQuery } from "@tanstack/react-query";
import { getChapters, getSurah } from "./chapter.queries";

export const useChaptersQuery = () => {
  return useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useSurahQuery = ({
  surahNumber,
  edition = "quran-uthmani",
  offset,
  limit,
}: {
  surahNumber: number;
  edition?: string;
  offset?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["surah", surahNumber, edition, offset, limit],
    queryFn: () => getSurah(surahNumber, edition, offset, limit),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
