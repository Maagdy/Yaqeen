import { useQuery } from "@tanstack/react-query";
import { getRadios } from "./radio-queries";
import { useLanguage } from "../../../hooks/useLanguage";
import { getStaticRadios } from "@/data/static-radios";

export const useRadios = (language?: string) => {
  const { language: contextLanguage } = useLanguage();
  const finalLanguage = language || contextLanguage;

  return useQuery({
    queryKey: ["radios", finalLanguage],
    queryFn: async () => {
      // Fetch API radios for current language
      const apiRadios = await getRadios(finalLanguage);

      // Get static radios with bilingual names for current language
      const staticRadios = getStaticRadios(finalLanguage);

      // Merge static radios with API radios
      return [...staticRadios, ...apiRadios];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
