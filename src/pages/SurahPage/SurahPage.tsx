import { useParams } from "react-router-dom";
import type { SurahPageProps } from "./SurahPage.types";
import { SurahDetails } from "../../components/common";
import { useLanguage } from "../../hooks";
import { Loading } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useSurahQuery } from "../../api";
import ErrorPage from "../ErrorPage/ErrorPage";

const SurahPage: React.FC<SurahPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const surahNumber = Number(id);
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  const {
    data: surah,
    isLoading,
    isError,
  } = useSurahQuery({
    surahNumber,
    edition,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (isError || !surah) {
    return <ErrorPage message={t("surah.error_loading_page")} showBackButton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SurahDetails surah={surah} ayahs={surah.ayahs} />
    </div>
  );
};

export default SurahPage;
