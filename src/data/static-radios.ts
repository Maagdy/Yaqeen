import type { Radio } from "@/api/domains/radio/radio.types";

/**
 * Static radio stations that are not available from the API
 * These are custom radio stations with direct streaming URLs
 */
export interface StaticRadioConfig {
  id: number;
  nameAr: string;
  nameEn: string;
  url: string;
}

/**
 * Configuration for static radio stations
 * Start IDs from a high number to avoid conflicts with API radios
 */
export const STATIC_RADIOS_CONFIG: StaticRadioConfig[] = [
  {
    id: 10000, // High ID to avoid conflicts with API radios
    nameAr: "إذاعة القرآن الكريم",
    nameEn: "Holy Quran Radio",
    url: "https://n0d.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABnGvnQZsAGuxGEaOyzQq-5g",
  },
];

/**
 * Convert static radio configuration to Radio objects with bilingual names
 * @param language - Current language (en or ar)
 * @returns Array of Radio objects with name and secondaryName
 */
export const getStaticRadios = (language: string): Radio[] => {
  return STATIC_RADIOS_CONFIG.map((config) => ({
    id: config.id,
    name: language === "ar" ? config.nameAr : config.nameEn,
    url: config.url,
    recent_date: new Date().toISOString(),
    // Add secondary name for bilingual display
    secondaryName: language === "ar" ? config.nameEn : config.nameAr,
  }));
};
