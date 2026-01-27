import { useQuery } from "@tanstack/react-query";
import { getJuzs } from "../queries/JuzsQuery";

export const useJuzsQuery = () => {
  return useQuery({
    queryKey: ["juzs"],
    queryFn: getJuzs,
    staleTime: 24 * 60 * 60 * 1000,
  });
};
