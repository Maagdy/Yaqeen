import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetRecitersParams, Reciter } from "./reciters.types";
import { getReciters } from "./reciters-queries";

export const useReciters = (params?: GetRecitersParams) => {
  const { language, rewaya, sura, reciter } = params ?? {};
  const reciterId = reciter && 0 >= reciter ? 1 : reciter;
  const queryClient = useQueryClient();

  return useQuery<Reciter[]>({
    queryKey: ["reciters", { language, rewaya, sura, reciterId }] as const,
    queryFn: async () => {
      // Determine the opposite language
      const otherLanguage = language === "ar" ? "en" : "ar";

      // Create params for the other language
      const otherParams: GetRecitersParams = {
        ...params,
        language: otherLanguage,
      };

      // Fetch both languages in parallel
      const [currentData, otherData] = await Promise.all([
        getReciters(params),
        getReciters(otherParams),
      ]);

      // Cache the other language for instant switching
      queryClient.setQueryData<Reciter[]>(
        ["reciters", { language: otherLanguage, rewaya, sura, reciterId }],
        otherData
      );

      // Return the requested language (preserves existing behavior)
      return currentData;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
