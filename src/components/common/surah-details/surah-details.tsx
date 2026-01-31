// src/components/surah-details/surah-details.tsx
import type { SurahDetailsProps } from "./surah-details.types";
import { useTranslation } from "react-i18next";
import {
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
} from "@mui/icons-material";
import { IconButton } from "../icon-button/icon-button";
import { useEffect } from "react";
import { useLanguage } from "../../../hooks";
import { useSurahNavigation } from "../../../hooks/useSurahNavigation";
import { useAudio } from "../../../hooks/useAudio";
import type { Ayah } from "../../../api";

export const SurahDetails: React.FC<SurahDetailsProps> = ({ surah, ayahs }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { play, pause, isPlaying, currentSurahNumber, currentAudio } =
    useAudio();
  const { setNavigationHandlers, clearNavigationHandlers } =
    useSurahNavigation();

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
    <div className="mb-12 pb-24">
      {/* Surah Header - Centered */}
      <div className="mb-6 pb-4 border-b-2 border-primary/20 text-center">
        <h2
          className={`text-2xl md:text-3xl font-bold text-primary mb-2 ${
            language === "ar" ? "font-amiri" : ""
          }`}
        >
          {language === "ar" ? surah.name : surah.englishName}
        </h2>
        {/* Listen to Full Surah Button */}
        {fullSurahAudioUrl && (
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
        )}
        <p className="text-sm text-text-secondary">
          {t(
            surah.revelationType.toLowerCase() === "meccan"
              ? "home.revelation_place.makkah"
              : "home.revelation_place.madinah",
          )}{" "}
          • {surah.numberOfAyahs} {t("home.verses")}
        </p>
      </div>
      {/* Ayahs - Centered and Clickable */}
      <div
        className={`space-y-4 text-center ${
          language === "ar" ? "font-amiri" : ""
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
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
                <div>
                  <span
                    onClick={() => handleAyahClick(ayah)}
                    className={`text-xl md:text-2xl ${language === "ar" ? "cursor-pointer" : ""} hover:text-primary/80 transition-colors ${
                      isAyahPlaying ? "text-primary" : ""
                    }`}
                    title={t("audio.click_to_play")}
                  >
                    {ayah.text}
                  </span>
                  {/* Ayah Number Badge - Arabic Glyph Style */}
                  <span className="inline-flex items-center justify-center relative">
                    <span className="inline-flex items-center justify-center relative mx-1 w-9 h-9">
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
                      <span className="relative z-10 text-sm font-bold text-text-primary">
                        {ayah.numberInSurah}
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
