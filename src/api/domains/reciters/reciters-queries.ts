import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type {
  GetRecitersParams,
  Reciter,
  RecitersResponse,
} from "./reciters.types";

export const getReciters = async (
  params?: GetRecitersParams,
): Promise<Reciter[]> => {
  const { language, ...otherParams } = params || {};
  const data = await client.get<RecitersResponse>(ENDPOINTS.RECITERS(language), {
    params: otherParams,
  });
  return data.reciters;
};
