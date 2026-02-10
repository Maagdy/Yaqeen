import { useQuery } from "@tanstack/react-query";
import { searchQuran } from "./search-queries";
import type { SearchParams } from "./search.types";

export const useSearchQueries = (
  params: SearchParams,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ["search", params.keyword, params.scope, params.edition],
    queryFn: () => searchQuran(params),
    enabled: enabled && !!params.keyword,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
