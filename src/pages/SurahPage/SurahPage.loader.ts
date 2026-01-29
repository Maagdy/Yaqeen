import type { LoaderFunctionArgs } from "react-router-dom";
import { getChapters, getSurah } from "../../api/queries/ChaptersQuery";

export const surahPageLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id) {
    throw new Error("surah.error_id_required");
  }

  const surahNumber = Number(id);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error("surah.error_invalid_surah");
  }

  // Get language from localStorage or default to 'ar'
  const language = localStorage.getItem("language") || "ar";
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  // Prefetch both chapters list and the specific surah
  const [chapters, surah] = await Promise.all([
    getChapters(),
    getSurah(surahNumber, edition),
  ]);

  return { chapters, surah, surahNumber, edition };
};
