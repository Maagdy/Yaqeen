import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type { TafsirBook } from "./tafsir.types";

export const getTafsirBooks = async (): Promise<TafsirBook[]> => {
  return client.get<TafsirBook[]>(ENDPOINTS.ALL_TAFSIR_BOOKS);
};
