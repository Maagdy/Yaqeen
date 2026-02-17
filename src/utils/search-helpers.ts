import type { Radio } from "@/api/domains/radio/radio.types";
import { normalizeSearchText } from "./arabic-normalizer";

/**
 * Search through radio stations by name (with Arabic normalization)
 * @param radios - Array of radio stations to search
 * @param keyword - Search keyword
 * @returns Filtered array of matching radio stations
 */
export const searchRadios = (radios: Radio[], keyword: string): Radio[] => {
  if (!keyword.trim()) return [];

  const normalizedKeyword = normalizeSearchText(keyword);

  return radios.filter((radio) => {
    const normalizedName = normalizeSearchText(radio.name);
    const normalizedSecondaryName = radio.secondaryName
      ? normalizeSearchText(radio.secondaryName)
      : "";

    return (
      normalizedName.includes(normalizedKeyword) ||
      normalizedSecondaryName.includes(normalizedKeyword)
    );
  });
};
