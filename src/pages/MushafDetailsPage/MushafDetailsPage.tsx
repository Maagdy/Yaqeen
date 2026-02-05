import { useMushafMetadata, useMushafSurahs } from "@/api/domains/mushafs";
import { Loading } from "@/components/ui";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconButton, MushafSurahCard } from "@/components/common";
import { useLanguage } from "@/hooks";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { generateRoute } from "@/router/routes";

const SURAHS_PER_PAGE = 10;

function MushafDetailsPage() {
  const { t } = useTranslation();
  const { mushafId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { isRtl } = useLanguage();
  const navigate = useNavigate();
  const {
    data: metadata,
    isLoading: metadataLoading,
    isError: metadataError,
    error: metadataErrorObj,
    refetch: refetchMetadata,
  } = useMushafMetadata(Number(mushafId));

  const startSurah = (currentPage - 1) * SURAHS_PER_PAGE + 1;
  const endSurah = Math.min(currentPage * SURAHS_PER_PAGE, 114);

  const {
    data: surahs,
    isLoading: surahsLoading,
    isError: surahsError,
    error: surahsErrorObj,
    refetch: refetchSurahs,
  } = useMushafSurahs(Number(mushafId), startSurah, endSurah);

  const totalPages = Math.ceil(114 / SURAHS_PER_PAGE);

  // Handle loading state
  if (metadataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  // Handle error state
  if (metadataError || !metadata) {
    return (
      <ErrorPage
        error={metadataErrorObj}
        onRetry={refetchMetadata}
        showHomeButton
        showRetryButton
        title={t("mushaf-details.error_loading_page")}
      />
    );
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleMushafSurahNavigate = (surahId: number) => {
    navigate(generateRoute.mushafSurah(Number(mushafId), surahId));
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Mushaf Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
        <p className="text-muted-foreground mb-4">{metadata.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="font-semibold">
              {t("mushaf-details.narrator")}:{" "}
            </span>
            <span>{metadata.rawi.full_name}</span>
          </div>
          <div>
            <span className="font-semibold">{t("mushaf-details.qiraa")}: </span>
            <span>{metadata.rawi.qiraa.full_name}</span>
          </div>
        </div>
      </div>

      {/* Surahs Loading State */}
      {surahsLoading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loading size="md" message={t("mushaf-details.loading_surahs")} />
        </div>
      )}

      {/* Surahs Error State */}
      {surahsError && (
        <ErrorPage
          error={surahsErrorObj}
          onRetry={refetchSurahs}
          showRetryButton
          title={t("mushaf-details.error_loading_surahs")}
        />
      )}

      {/* Surahs List */}
      {!surahsLoading && !surahsError && surahs && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("mushaf-details.surahs")} {startSurah}-{endSurah}{" "}
              {t("mushaf-details.of")} {metadata.totalSurahs}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {surahs.map((surah) => (
                <MushafSurahCard
                  key={surah.id}
                  surah={surah}
                  onClick={() => handleMushafSurahNavigate(surah.id)}
                />
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-8 border-t border-primary pt-6">
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
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
                {t("mushaf-details.page")} {currentPage}{" "}
                {t("mushaf-details.of")} {totalPages}
              </span>
            </div>

            <IconButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
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
      )}
    </div>
  );
}

export default MushafDetailsPage;
