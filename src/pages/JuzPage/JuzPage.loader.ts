import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "../../providers/queryClient";
import { getJuz } from "../../api/queries/JuzsQuery";
import type { Language } from "../../types";

export const juzPageLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error("juz.error_id_required");
  }

  const juzNumber = Number(params.id);

  if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
    throw new Error("juz.error_invalid_juz");
  }

  // Get language from localStorage (Zustand persists to 'sabeel-preferences')
  let language: Language = "en";
  try {
    const stored = localStorage.getItem("sabeel-preferences");
    if (stored) {
      const preferences = JSON.parse(stored);
      language = preferences.state?.language || "en";
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }

  // Determine edition based on language
  const edition = language === "ar" ? "quran-uthmani" : "en.asad";

  // Prefetch the data - will use cache if available and fresh
  await queryClient.ensureQueryData({
    queryKey: ["juz", juzNumber, edition],
    queryFn: () => getJuz(juzNumber, edition),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return null;
};
