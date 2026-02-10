import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { ReciterDetailsPageProps } from "./ReciterDetailsPage.types";
import { useReciters } from "../../api";
import ErrorPage from "../ErrorPage/ErrorPage";
import {
  ReciterInfo,
  ReciterSurahsList,
} from "../../components/pages/reciter-details-components";
import { Loading } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks";
import { useAudio } from "../../hooks/useAudio";
import { useSurahNavigation } from "../../hooks/useSurahNavigation";
import { toast } from "react-toastify";
import { quranSurahs } from "../../utils/constants";

const ReciterDetailsPage: React.FC<ReciterDetailsPageProps> = () => {
  const { language } = useLanguage();
  const { reciterId } = useParams<{ reciterId: string }>();
  const { data, isPending, isError, refetch, error } = useReciters({
    reciter: Number(reciterId),
    language,
  });
  const { t } = useTranslation();
  const { play, pause, isPlaying, currentSurahNumber } = useAudio();
  const { setNavigationHandlers, clearNavigationHandlers } =
    useSurahNavigation();

  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState(0);

  const reciter = data?.[0];
  const selectedMoshaf = reciter?.moshaf[selectedMoshafIndex];

  const surahList = useMemo(
    () => selectedMoshaf?.surah_list.split(",") || [],
    [selectedMoshaf],
  );

  const handlePlay = useCallback(
    (surahNumber: number) => {
      if (!selectedMoshaf?.server) return;

      const paddedSurahNumber = String(surahNumber).padStart(3, "0");
      const audioUrl = `${selectedMoshaf.server}/${paddedSurahNumber}.mp3`;

      if (isPlaying && currentSurahNumber === surahNumber) {
        pause();
      } else {
        play(audioUrl, surahNumber);
      }
    },
    [selectedMoshaf, isPlaying, currentSurahNumber, pause, play],
  );

  // Setup navigation handlers
  useEffect(() => {
    if (!surahList.length) return;

    // Only set navigation handlers if something is actually playing
    // AND the playing surah is part of this list.
    if (!currentSurahNumber) return;

    const currentIndex = surahList.findIndex(
      (id) => Number(id) === currentSurahNumber,
    );

    if (currentIndex === -1) return;

    const handleNext = () => {
      if (currentIndex < surahList.length - 1) {
        handlePlay(Number(surahList[currentIndex + 1]));
      }
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
        handlePlay(Number(surahList[currentIndex - 1]));
      }
    };

    setNavigationHandlers({
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: currentIndex < surahList.length - 1,
      canGoPrevious: currentIndex > 0,
    });

    return () => {
      clearNavigationHandlers();
    };
  }, [
    currentSurahNumber,
    surahList,
    setNavigationHandlers,
    clearNavigationHandlers,
    handlePlay,
  ]);

  if (Number(reciterId) <= 0) {
    return (
      <ErrorPage
        message={t("reciter-details.error_loading_page")}
        showBackButton
        error={error}
        showHomeButton
        showRetryButton
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  if (isPending) {
    return <Loading size="lg" message={t("reciter-details.loading")} />;
  }

  if (!reciter || isError) {
    return <ErrorPage message={t("reciter-details.error_loading_page")} />;
  }

  const handleDownload = async (surahNumber: number) => {
    if (!selectedMoshaf?.server) return;

    const paddedSurahNumber = String(surahNumber).padStart(3, "0");
    const audioUrl = `${selectedMoshaf.server}/${paddedSurahNumber}.mp3`;

    // Find surah data to get Arabic name
    const surahData = quranSurahs.find((s) => s.number === surahNumber);
    const surahName = surahData?.arabicName || paddedSurahNumber;
    const fileName = `${reciter.name}_${selectedMoshaf.name}_${surahName}.mp3`;

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed, falling back to direct link", error);
      // Fallback to opening in new tab
      const link = document.createElement("a");
      link.href = audioUrl;
      link.target = "_blank";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = (surahNumber: number) => {
    const surahLink = `${window.location.origin}/surah/${surahNumber}`;
    navigator.clipboard
      .writeText(surahLink)
      .then(() => {
        // You could add a toast notification here
        toast.success(t("reciter-details.link_copied"));
      })
      .catch((err) => {
        toast.error(t("reciter-details.link_copy_failed"));
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {reciter && (
        <ReciterInfo
          reciter={reciter}
          selectedMoshafIndex={selectedMoshafIndex}
          onMoshafSelect={setSelectedMoshafIndex}
        />
      )}

      <ReciterSurahsList
        surahList={surahList}
        isPlaying={isPlaying}
        currentSurahNumber={currentSurahNumber}
        language={language}
        onPlay={handlePlay}
        onDownload={handleDownload}
        onCopyLink={handleCopyLink}
        reciter={reciter}
      />
    </div>
  );
};

export default ReciterDetailsPage;
