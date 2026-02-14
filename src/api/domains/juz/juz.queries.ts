import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type {
  AlQuranResponse,
  JuzData,
  JuzMeta,
  MetaResponse,
} from "./juz.types";

export const getJuzs = async (): Promise<JuzMeta[]> => {
  const data = await client.get<AlQuranResponse<MetaResponse>>(ENDPOINTS.META);
  return data.data.juzs.references;
};

export const getJuz = async (
  juzNumber: number,
  edition: string = "quran-uthmani",
): Promise<JuzData> => {
  const data = await client.get<AlQuranResponse<JuzData>>(
    ENDPOINTS.JUZ(juzNumber, edition),
  );
  return data.data;
};
