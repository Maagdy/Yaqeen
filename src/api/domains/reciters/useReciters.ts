import { useQuery } from "@tanstack/react-query";
import type { GetRecitersParams, Reciter } from "./reciters.types";
import { getReciters } from "./reciters-queries";

export const useReciters = (params?: GetRecitersParams) => {
  const { language, rewaya, sura, reciter } = params ?? {};
  const reciterId = reciter && 0 >= reciter ? 1 : reciter;
  return useQuery<Reciter[]>({
    queryKey: ["reciters", { language, rewaya, sura, reciterId }] as const,
    queryFn: () => getReciters(params),
    staleTime: 1000 * 60 * 10,
  });
};
