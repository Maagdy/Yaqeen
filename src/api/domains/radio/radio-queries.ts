import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type { Radio, RadioResponse } from "./radio.types";

export const getRadios = async (language: string = "eng"): Promise<Radio[]> => {
  const response = await client.get<RadioResponse>(ENDPOINTS.RADIO(language));
  return response.radios;
};
