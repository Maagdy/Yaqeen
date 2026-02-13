import axios from "axios";
import { ENDPOINTS, ALQURAN_BASE_URL } from "../../endpoints";
import type { SearchResponse, SearchParams } from "./search.types";

export const searchQuran = async ({
  keyword,
  scope = "all",
  edition = "en.pickthall", // Default to English translation as requested
}: SearchParams): Promise<SearchResponse> => {
  // Language Detection: Check if keyword contains Arabic characters
  const arabicPattern = /[\u0600-\u06FF]/;
  const isArabic = arabicPattern.test(keyword);

  // If input is Arabic, FORCE edition to be an Arabic Quran edition
  // regardless of what was passed (unless user specifically requested a different Arabic edition,
  // but usually they just want "search results").
  // 'quran-simple' is a good standard for Arabic search.
  let searchEdition = edition;
  if (isArabic) {
    searchEdition = "quran-simple";
  } else {
    // Use 'quran-simple' as a fallback if edition is empty, but allow comma-separated values
    searchEdition = edition || "en.pickthall";
  }

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
