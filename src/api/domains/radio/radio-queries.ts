import { client } from "../../client";
import { ENDPOINTS } from "../../endpoints";
import type { Radio } from "./radio.types";

interface RadioResponse {
  radios: Radio[];
}

export const getRadios = async (language: string = "eng"): Promise<Radio[]> => {
  const response = await client.get<RadioResponse>(ENDPOINTS.RADIO(language));
  return response.radios;
};
