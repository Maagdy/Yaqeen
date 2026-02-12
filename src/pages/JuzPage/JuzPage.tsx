import { useParams } from "react-router-dom";
import type { JuzPageProps } from "./JuzPage.types";
import { useTranslation } from "react-i18next";
import { useJuzQuery, type Ayah } from "../../api";
import { useLanguage } from "../../hooks";
import { Loading } from "../../components/ui";
import ErrorPage from "../ErrorPage/ErrorPage";
import { SurahDetails } from "@/components/pages/surah-components/surah-details";

const JuzPage: React.FC<JuzPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const juzNumber = Number(id);
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  const { data: juz, isLoading, isError } = useJuzQuery(juzNumber, edition);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (isError || !juz) {
    return <ErrorPage message={t("juz.error_loading_page")} />;
  }

  // Group ayahs by surah
  const ayahsBySurah: Record<number, Ayah[]> = {};
  juz.ayahs.forEach((ayah) => {
    const surahNumber = ayah.surah.number;
    if (!ayahsBySurah[surahNumber]) {
      ayahsBySurah[surahNumber] = [];
    }
    ayahsBySurah[surahNumber].push(ayah);
  });

  // Get sorted surah numbers
  const surahNumbers = Object.keys(ayahsBySurah)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-6">
        <div className="max-w-4xl mx-auto px-4 ">
          <h1 className="text-3xl font-bold text-text-primary text-center">
            {t("juz.title", { number: juzNumber })}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {surahNumbers.map((surahNumber) => {
          const surah = juz.surahs[surahNumber];
          const ayahs = ayahsBySurah[surahNumber];

          return <SurahDetails key={surahNumber} surah={surah} ayahs={ayahs} />;
        })}
      </div>
    </div>
  );
};

export default JuzPage;
