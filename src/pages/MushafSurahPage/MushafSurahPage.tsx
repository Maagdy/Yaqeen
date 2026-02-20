import { useMushafSurah } from "@/api/domains/mushafs";
import { Loading } from "@/components/ui";
import { useParams, useNavigate } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useTranslation } from "react-i18next";
import { MushafSurahDetails } from "@/components/pages";
import { IconButton, ReadingProgressIndicator } from "@/components/common";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useLanguage } from "@/hooks";
import { generateRoute } from "@/router/routes";
import { formatNumber } from "@/utils/numbers";
import { useViewportPageTracker } from '@/hooks/useViewportPageTracker';
import { useSmartPrefetch } from "@/hooks/useSmartPrefetch";

function MushafSurahPage() {
  const { surahId, mushafId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();

  const currentSurahId = Number(surahId);
  const currentMushafId = Number(mushafId);

  const {
    data: surah,
    isLoading: surahLoading,
    isError: surahError,
    error: surahErrorObj,
    refetch: refetchSurah,
  } = useMushafSurah(currentMushafId, currentSurahId);

  // Prefetch nearby mushaf surahs for offline PWA use
  useSmartPrefetch({ type: "mushaf-surah", params: { mushafId: currentMushafId, surahNumber: currentSurahId } });

  // Track mushaf pages read when user leaves page
  useViewportPageTracker(surah?.ayahs || [], {
    enabled: !!surah,
  });

  const handlePreviousPage = () => {
    if (currentSurahId > 1) {
      navigate(generateRoute.mushafSurah(currentMushafId, currentSurahId - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentSurahId < 114) {
      navigate(generateRoute.mushafSurah(currentMushafId, currentSurahId + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (surahLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading message={t("surah.loading", { surahName: "" })} size="lg" />
      </div>
    );
  }

  if (surahError || !surah) {
    return (
      <ErrorPage
        error={surahErrorObj}
        onRetry={refetchSurah}
        showHomeButton
        showRetryButton
        title={t("surah.error_loading_page")}
      />
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ReadingProgressIndicator />
        <MushafSurahDetails surah={surah} mushafId={currentMushafId} />
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-8 flex items-center justify-between border-t border-primary pt-6 mb-8">
        <IconButton
          onClick={handlePreviousPage}
          disabled={currentSurahId === 1}
          iconPosition={"left"}
          label={t("mushaf-details.previous")}
          icon={
            isRtl ? (
              <ArrowForwardIos fontSize="small" />
            ) : (
              <ArrowBackIos fontSize="small" />
            )
          }
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("common.surah", { defaultValue: "Surah" })}{" "}
            {formatNumber(currentSurahId, language)} {t("mushaf-details.of")}{" "}
            {formatNumber(114, language)}
          </span>
        </div>

        <IconButton
          onClick={handleNextPage}
          disabled={currentSurahId === 114}
          iconPosition={"right"}
          label={t("mushaf-details.next")}
          icon={
            isRtl ? (
              <ArrowBackIos fontSize="small" />
            ) : (
              <ArrowForwardIos fontSize="small" />
            )
          }
        />
      </div>
    </>
  );
}

export default MushafSurahPage;
