import { client } from "../client";
import { API_BASE_URL, ENDPOINTS } from "../endpoints";
import type { AlQuranResponse, Surah } from "./queries.types";

export const getChapters = async (): Promise<Surah[]> => {
  const data = await client.get<AlQuranResponse<Surah[]>>(
    `${API_BASE_URL}${ENDPOINTS.SURAHS}`,
  );
  return data.data;
};
