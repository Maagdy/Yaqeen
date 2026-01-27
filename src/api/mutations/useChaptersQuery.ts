import { useQuery } from "@tanstack/react-query";
import { getChapters } from "../queries/ChaptersQuery";

export const useChaptersQuery = () => {
  return useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
    staleTime: 24 * 60 * 60 * 1000,
  });
};
