import { useQuery } from "@tanstack/react-query";
import { getRadios } from "./radio-queries";
import { useLanguage } from "../../../hooks/useLanguage";

export const useRadios = (language?: string) => {
  const { language: contextLanguage } = useLanguage();
  const finalLanguage = language || contextLanguage;

  return useQuery({
    queryKey: ["radios", finalLanguage],
    queryFn: () => getRadios(finalLanguage),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
