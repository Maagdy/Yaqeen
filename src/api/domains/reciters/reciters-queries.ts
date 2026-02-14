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
  const data = await client.get<RecitersResponse>(ENDPOINTS.RECITERS, {
    params,
  });
  return data.reciters;
};
