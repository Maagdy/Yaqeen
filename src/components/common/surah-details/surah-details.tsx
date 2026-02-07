// src/components/surah-details/surah-details.tsx
import type { SurahDetailsProps } from "./surah-details.types";
import { useTranslation } from "react-i18next";
import {
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
  BookmarkAdd,
  Share,
} from "@mui/icons-material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { IconButton } from "../icon-button/icon-button";
import { useEffect, useState } from "react";
import { useLanguage, useMediaQuery } from "../../../hooks";
import { useSurahNavigation } from "../../../hooks/useSurahNavigation";
import { useAudio } from "../../../hooks/useAudio";
import type { Ayah } from "../../../api";
import { formatNumber } from "@/utils/numbers";

export const SurahDetails: React.FC<SurahDetailsProps> = ({
  surah,
  ayahs,
  onAyahClick,
}) => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  const { play, pause, isPlaying, currentSurahNumber, currentAudio } =
    useAudio();
  const { setNavigationHandlers, clearNavigationHandlers } =
    useSurahNavigation();
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // TODO: Get full surah audio URL from API
  const fullSurahAudioUrl = `https://server6.mp3quran.net/akdr/002.mp3`;

  // Set up navigation handlers when component mounts
  useEffect(() => {
    const handleNext = () => {
      // TODO: Implement your logic to get next surah
      // For example:
      // const nextSurahNumber = surah.number + 1;
      // if (nextSurahNumber <= 114) {
      //   const nextSurahAudioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${nextSurahNumber}.mp3`;
      //   play(nextSurahAudioUrl, nextSurahNumber);
      //   navigate to next surah page
      // }
      console.log("Next surah - implement your logic here");
    };

    const handlePrevious = () => {
      // TODO: Implement your logic to get previous surah
      // For example:
      // const prevSurahNumber = surah.number - 1;
      // if (prevSurahNumber >= 1) {
      //   const prevSurahAudioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${prevSurahNumber}.mp3`;
      //   play(prevSurahAudioUrl, prevSurahNumber);
      //   navigate to previous surah page
      // }
      console.log("Previous surah - implement your logic here");
    };

    setNavigationHandlers({
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: surah.number < 114, // Can go next if not last surah
      canGoPrevious: surah.number > 1, // Can go previous if not first surah
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

  return (
    <div className="mb-12 mt-4">
      {/* Surah Header - Centered */}
      <div className="mb-6 pb-4 border-b-2 border-primary/20">
        <div className="flex items-start justify-between">
          {/* Empty space for alignment */}
          <div className="w-20"></div>

          {/* Surah Name and Verse Count - Centered */}
          <div className="flex-1 text-center">
            <h2
              className={`text-2xl md:text-3xl font-bold text-primary mb-1 ${
                isRtl ? "font-amiri" : ""
              }`}
            >
              {isRtl ? surah.name : surah.englishName}
            </h2>
            <p className="text-sm text-text-secondary">
              {t(
                surah.revelationType.toLowerCase() === "meccan"
                  ? "home.revelation_place.makkah"
                  : "home.revelation_place.madinah",
              )}{" "}
              • {formatNumber(surah.numberOfAyahs, language)} {t("home.verses")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Share fontSize="medium" />}
              onClick={() => {
                // TODO: Implement share logic
                console.log("Share clicked");
              }}
              className="text-primary/70 hover:text-primary"
              size="sm"
            />
            <IconButton
              icon={<BookmarkAdd fontSize="medium" />}
              onClick={() => {
                // TODO: Implement bookmark logic
                console.log("Bookmark clicked");
              }}
              className="text-primary/70 hover:text-primary"
              size="sm"
            />
          </div>
        </div>

        {/* Listen to Full Surah Button */}
        {fullSurahAudioUrl && (
          <div className="mt-4 text-center">
            <IconButton
              onClick={handleFullSurahClick}
              icon={
                isFullSurahPlaying ? (
                  <PauseCircleFilledRounded />
                ) : (
                  <PlayCircleFilledRounded />
                )
              }
              label={
                isFullSurahPlaying
                  ? t("surah.pause_full")
                  : t("surah.listen_full")
              }
              className="mx-auto"
              size="md"
            />
          </div>
        )}
      </div>
      {/* Ayahs - Centered and Clickable */}
      <div
        className={`space-y-4 text-center ${isRtl ? "font-amiri" : ""}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {ayahs.map((ayah) => {
          const isAyahPlaying =
            isPlaying &&
            currentSurahNumber === surah.number &&
            currentAudio === ayah.audio;

          return (
            <div
              key={ayah.number}
              className="leading-loose text-text-primary p-2"
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  onMouseEnter={() => !isMobile && setHoveredAyah(ayah.number)}
                  onMouseLeave={() => !isMobile && setHoveredAyah(null)}
                  className="relative"
                >
                  {/* Desktop: Show on hover, Mobile: Always show */}
                  {(hoveredAyah === ayah.number || isMobile) && (
                    <div
                      className={`${
                        isMobile
                          ? "inline-flex ml-2"
                          : "absolute bottom-full left-1/2 transform -translate-x-1/2 z-10"
                      }`}
                    >
                      <IconButton
                        label={isMobile ? "" : t("surah.ayah-details")}
                        onClick={() => onAyahClick?.(ayah)}
                        size={isMobile ? "sm" : "md"}
                        icon={<TipsAndUpdatesIcon fontSize="small" />}
                      />
                    </div>
                  )}
                  <span
                    onClick={() => handleAyahClick(ayah)}
                    className={`text-xl md:text-2xl ${isRtl ? "cursor-pointer" : ""} hover:text-primary/80 transition-colors ${
                      isAyahPlaying ? "text-primary" : ""
                    }`}
                    title={t("audio.click_to_play")}
                  >
                    {ayah.text}
                  </span>
                  {/* Ayah Number Badge - Arabic Glyph Style */}
                  <span className="inline-flex items-center justify-center relative ">
                    <span className="inline-flex items-center justify-center relative mx-1 w-10 h-10 pt-1">
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 36 36"
                      >
                        {/* Octagonal shape */}
                        <path
                          d="M18 2 L26 6 L30 14 L30 22 L26 30 L18 34 L10 30 L6 22 L6 14 L10 6 Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={
                            isAyahPlaying ? "text-primary" : "text-primary/90"
                          }
                        />
                      </svg>
                      <span className="relative z-10 text-base font-bold text-text-primary">
                        {formatNumber(ayah.numberInSurah, language)}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
