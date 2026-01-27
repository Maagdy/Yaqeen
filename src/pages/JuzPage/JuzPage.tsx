import { useParams } from "react-router-dom";
import type { JuzPageProps } from "./JuzPage.types";
import { useJuzQuery } from "../../api/mutations/useJuzsQuery";
import { useLanguage } from "../../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/ui/Loading";
import ErrorPage from "../ErrorPage/ErrorPage";
import { SurahDetails } from "../../components/common/surah-details/surah-details";
import type { Ayah } from "../../api/queries/queries.types";

const JuzPage: React.FC<JuzPageProps> = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Choose edition based on app language
  const edition = language === "ar" ? "quran-uthmani" : "en.asad";

  const { data: juz, isPending, isError } = useJuzQuery(Number(id), edition);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading message={t("juz.loading", { number: id })} size="lg" />
      </div>
    );
  }

  if (isError || !juz) {
    return (
      <ErrorPage
        title={t("juz.error_loading", { number: id })}
        message={t("error.message")}
      />
    );
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
            {t("juz.title", { number: id })}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {surahNumbers.map((surahNumber) => {
          const surah = juz.surahs[surahNumber];
          const ayahs = ayahsBySurah[surahNumber];

          return (
            <SurahDetails
              key={surahNumber}
              surah={surah}
              ayahs={ayahs}
              language={language}
            />
          );
        })}
      </div>
    </div>
  );
};

export default JuzPage;
