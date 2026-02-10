import axios from "axios";
import { ENDPOINTS, ALQURAN_BASE_URL } from "../../endpoints";
import type { SearchResponse, SearchParams } from "./search.types";

export const searchQuran = async ({
  keyword,
  scope = "all",
  edition = "en.pickthall", // Default to English translation as requested
}: SearchParams): Promise<SearchResponse> => {
  // Use 'quran-simple' as a fallback if edition is empty, but allow comma-separated values
  const searchEdition = edition || "en.pickthall";
  const url = `${ALQURAN_BASE_URL}${ENDPOINTS.SEARCH(keyword, String(scope), searchEdition)}`;
  try {
    const { data } = await axios.get<SearchResponse>(url);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        code: 200,
        status: "OK",
        data: {
          count: 0,
          matches: [],
        },
      };
    }
    throw error;
  }
};
