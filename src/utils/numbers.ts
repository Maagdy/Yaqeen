/**
 * Converts English numerals to Arabic (Eastern Arabic) numerals
 * @param num - Number to convert
 * @returns String with Arabic numerals
 */
export const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
};

/**
 * Formats a number based on the current language
 * @param num - Number to format
 * @param language - Current language ('ar' or 'en')
 * @returns Formatted number string
 */
export const formatNumber = (
  num: number | string,
  language: string,
): string => {
  return language === "ar" ? toArabicNumerals(num) : String(num);
};

/**
 * Formats a hizbQuarter (1–240) into a readable hizb string
 * e.g. 1 → "1", 2 → "1 ¼", 3 → "1 ½", 4 → "1 ¾", 5 → "2"
 */
export const formatHizbQuarter = (
  hizbQuarter: number,
  language: string,
): string => {
  const hizb = Math.ceil(hizbQuarter / 4);
  const quarter = ((hizbQuarter - 1) % 4);
  const fractions = ["", " ¼", " ½", ""];
  return formatNumber(hizb, language) + fractions[quarter];
};
