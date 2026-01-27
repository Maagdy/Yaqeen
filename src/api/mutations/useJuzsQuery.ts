import { useQuery } from "@tanstack/react-query";
import { getJuz, getJuzs } from "../queries/JuzsQuery";

export const useJuzsQuery = () => {
  return useQuery({
    queryKey: ["juzs"],
    queryFn: getJuzs,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useJuzQuery = (juzNumber: number, edition?: string) => {
  return useQuery({
    queryKey: ["juz", juzNumber, edition],
    queryFn: () => getJuz(juzNumber, edition),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
