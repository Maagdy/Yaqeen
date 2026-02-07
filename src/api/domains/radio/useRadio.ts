import { useQuery } from "@tanstack/react-query";
import { getRadios } from "./radio-queries";
import { useLanguage } from "../../../hooks/useLanguage";

export const useRadios = () => {
  const { language } = useLanguage();
  return useQuery({
    queryKey: ["radios", language],
    queryFn: () => getRadios(language),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
