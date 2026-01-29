import { useParams } from "react-router-dom";
import type { SurahPageProps } from "./SurahPage.types";
import {
  useSurahQuery,
  useChaptersQuery,
} from "../../api/mutations/useChaptersQuery";
import { SurahDetails } from "../../components/common/surah-details/surah-details";
import { Loading } from "../../components/ui/Loading";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks";
import { GlobalAudioPlayer } from "../../components/common/global-audio-player";
import { useAudioStore } from "../../stores/useAudioStore";
import { useEffect } from "react";

const SurahPage: React.FC<SurahPageProps> = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";
  const { closePlayer } = useAudioStore();

  // Close audio player when language changes to reload with correct edition
  useEffect(() => {
    closePlayer();
  }, [language, closePlayer]);

  // Fetch all chapters to get the surah name for loading/error states
  const { data: chapters } = useChaptersQuery();
  const chapter = chapters?.find((ch) => ch.number === Number(id));
  const surahName = language === "ar" ? chapter?.name : chapter?.englishName;

  const {
    data: surah,
    isPending,
    isError,
  } = useSurahQuery({ surahNumber: Number(id), edition });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading message={t("surah.loading", { surahName })} size="lg" />
      </div>
    );
  }

  if (isError || !surah) {
    return (
      <ErrorPage
        title={t("surah.error-loading", { surahName })}
        message={t("error.message")}
      />
    );
  }
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SurahDetails
          key={id}
          surah={surah}
          ayahs={surah.ayahs}
          language={language}
        />
      </div>

      {/* Global Audio Player - Shows when playing */}
      <GlobalAudioPlayer />
    </>
  );
};

export default SurahPage;
