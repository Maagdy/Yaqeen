import { client } from "../../client";
import { ENDPOINTS, MP3QURAN_BASE_URL } from "../../endpoints";
import type {
  GetRecitersParams,
  Reciter,
  RecitersResponse,
} from "./reciters.types";

export const getReciters = async (
  params?: GetRecitersParams,
): Promise<Reciter[]> => {
  const data = await client.get<RecitersResponse>(
    `${MP3QURAN_BASE_URL}${ENDPOINTS.RECITERS}`,
    { params },
  );
  return data.reciters;
};
