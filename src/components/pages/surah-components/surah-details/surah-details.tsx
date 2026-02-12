// src/components/surah-details/surah-details.tsx
import type { SurahDetailsProps } from "./surah-details.types";
import { useEffect, useState } from "react";
import { useLanguage, useMediaQuery, useAuth } from "../../../../hooks";
import { useSurahNavigation } from "../../../../hooks/useSurahNavigation";
import { useAudio } from "../../../../hooks/useAudio";
import type { Ayah, Surah } from "../../../../api";
import { useFavoriteAyahsQuery } from "@/api/domains/user";
import { useMobileAyahHandlers } from "./hooks";
import { SurahHeader, MobileAyahsList, DesktopAyahsList } from "./components";
import { useTranslation } from "react-i18next";

export const SurahDetails: React.FC<SurahDetailsProps> = ({
  surah,
  ayahs,
  onAyahClick,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  const { user } = useAuth();
  const { play, pause, isPlaying, currentSurahNumber, currentAudio } =
    useAudio();
  const { setNavigationHandlers, clearNavigationHandlers } =
    useSurahNavigation();
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Favorite ayahs functionality
  const { data: favoriteAyahs = [] } = useFavoriteAyahsQuery(user?.id);

  // TODO: Get full surah audio URL from API
  const fullSurahAudioUrl = `https://server6.mp3quran.net/akdr/002.mp3`;

  // Set up navigation handlers when component mounts
  useEffect(() => {
    const handleNext = () => {
      // TODO: Implement your logic to get next surah
      console.log("Next surah - implement your logic here");
    };

    const handlePrevious = () => {
      // TODO: Implement your logic to get previous surah
      console.log("Previous surah - implement your logic here");
    };

    setNavigationHandlers({
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: surah.number < 114,
      canGoPrevious: surah.number > 1,
    });

    // Cleanup on unmount
    return () => {
      clearNavigationHandlers();
    };
  }, [surah.number, setNavigationHandlers, clearNavigationHandlers]);

  const handleAyahClick = (ayah: Ayah) => {
    if (!ayah.audio) {
      console.warn("No audio URL available for this ayah");
      return;
    }

    // If clicking the same ayah that's playing, pause it
    if (isPlaying && currentSurahNumber === ayah.number) {
      pause();
      return;
    }

    // Play the ayah
    play(ayah.audio, surah.number);
  };

  const handleFullSurahClick = () => {
    if (fullSurahAudioUrl) {
      // If the full surah is already playing, pause it
      if (isPlaying && currentAudio === fullSurahAudioUrl) {
        pause();
      } else {
        // Play the full surah
        play(fullSurahAudioUrl, surah.number);
      }
    }
  };

  const isFullSurahPlaying = isPlaying && currentAudio === fullSurahAudioUrl;

  // Helper function to create surah object for mobile card
  const getSurahForMobileCard = (): Surah => ({
    name: surah.name,
    number: surah.number,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType,
  });

  // Mobile ayah handlers
  const mobileHandlers = useMobileAyahHandlers({
    surah: getSurahForMobileCard(),
    favoriteAyahs,
    user,
    onAyahClick: handleAyahClick,
  });

  return (
    <div className="mb-12 mt-4">
      {/* Surah Header - Centered */}
      <SurahHeader
        surah={surah}
        isRtl={isRtl}
        language={language}
        fullSurahAudioUrl={fullSurahAudioUrl}
        isFullSurahPlaying={isFullSurahPlaying}
        onFullSurahClick={handleFullSurahClick}
      />

      {/* Ayahs - Mobile: Card View, Desktop: Centered View */}
      {isMobile ? (
        <MobileAyahsList
          ayahs={ayahs}
          surah={getSurahForMobileCard()}
          isPlaying={isPlaying}
          currentSurahNumber={currentSurahNumber}
          currentAudio={currentAudio}
          onPlay={mobileHandlers.handlePlay}
          onBookmark={mobileHandlers.handleBookmark}
          onShare={mobileHandlers.handleShare}
          onCopy={mobileHandlers.handleCopy}
          onTafsirClick={onAyahClick || (() => {})}
          isBookmarked={mobileHandlers.isBookmarked}
        />
      ) : (
        <DesktopAyahsList
          ayahs={ayahs}
          isRtl={isRtl}
          language={language}
          isMobile={isMobile}
          isPlaying={isPlaying}
          currentSurahNumber={currentSurahNumber}
          currentAudio={currentAudio}
          hoveredAyah={hoveredAyah}
          onAyahHover={setHoveredAyah}
          onAyahClick={handleAyahClick}
          onDetailsClick={onAyahClick}
        />
      )}

      {/* End of Surah Marker */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <span className="text-sm font-medium text-primary/70 px-4">
          {t("surah.end")}
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
};
