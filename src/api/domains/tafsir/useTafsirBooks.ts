import { useQuery } from "@tanstack/react-query";
import type { TafsirBook } from "./tafsir.types";
import { getTafsirBooks } from "./tafsir.queries";

export const useTafsirBooks = () => {
  return useQuery<TafsirBook[]>({
    queryKey: ["tafsir-books"] as const,
    queryFn: getTafsirBooks,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
