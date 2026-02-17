/**
 * Normalize Arabic text for search purposes
 * Removes diacritics and normalizes letter variations
 */
export const normalizeArabicText = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Normalize Alif variations (ا أ إ آ) to base Alif (ا)
      .replace(/[أإآ]/g, "ا")
      // Normalize Ta Marbuta (ة) to Ha (ه)
      .replace(/ة/g, "ه")
      // Normalize Alif Maksura (ى) to Ya (ي)
      .replace(/ى/g, "ي")
      // Remove all Arabic diacritics (Tashkeel)
      .replace(/[\u064B-\u065F]/g, "") // Fatha, Damma, Kasra, Sukun, Shadda, etc.
      // Remove Tatweel (ـ)
      .replace(/\u0640/g, "")
      // Trim and convert to lowercase
      .toLowerCase()
      .trim()
  );
};

/**
 * Normalize text for search (handles both Arabic and other languages)
 * @param text - Text to normalize
 * @returns Normalized text
 */
export const normalizeSearchText = (text: string): string => {
  if (!text) return "";

  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text);

  if (hasArabic) {
    return normalizeArabicText(text);
  }

  // For non-Arabic text, just lowercase and trim
  return text.toLowerCase().trim();
};
