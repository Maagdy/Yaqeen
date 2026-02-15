import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRadios } from "./radio-queries";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Radio } from "./radio.types";

export const useRadios = (language?: string) => {
  const { language: contextLanguage } = useLanguage();
  const finalLanguage = language || contextLanguage;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["radios", finalLanguage],
    queryFn: async () => {
      // Determine the opposite language
      const otherLanguage = finalLanguage === "ar" ? "en" : "ar";

      // Fetch both languages in parallel
      const [currentData, otherData] = await Promise.all([
        getRadios(finalLanguage),
        getRadios(otherLanguage),
      ]);

      // Cache the other language for instant switching
      queryClient.setQueryData<Radio[]>(
        ["radios", otherLanguage],
        otherData
      );

      // Return the requested language (preserves existing behavior)
      return currentData;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
