import { client } from "../client";
import { API_BASE_URL, ENDPOINTS } from "../endpoints";
import type {
  AlQuranResponse,
  MetaResponse,
  JuzMeta,
  JuzResponse,
} from "./queries.types";

export const getJuzs = async (): Promise<JuzMeta[]> => {
  const data = await client.get<AlQuranResponse<MetaResponse>>(
    `${API_BASE_URL}${ENDPOINTS.META}`,
  );
  return data.data.juzs.references;
};

export const getJuz = async (juzNumber: number): Promise<JuzResponse> => {
  const data = await client.get<AlQuranResponse<JuzResponse>>(
    `${API_BASE_URL}${ENDPOINTS.JUZ}/${juzNumber}`,
  );
  return data.data;
};
