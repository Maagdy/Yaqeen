import React from "react";
import type { ReciterSurahsListProps } from "./reciter-surahs-list.types";
import { ReciterSurahCard } from "../reciter-surah-card";
import { quranSurahs } from "../../../../utils/constants";

export const ReciterSurahsList: React.FC<ReciterSurahsListProps> = ({
  surahList,
  isPlaying,
  currentSurahNumber,
  language,
  onPlay,
  onDownload,
  onCopyLink,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {surahList?.map((surahId) => {
        const surahNumber = Number(surahId);
        const surahData = quranSurahs.find((s) => s.number === surahNumber);
        const mainSurahName =
          language === "en"
            ? surahData?.name || ""
            : surahData?.arabicName || "";
        const secondSurahName =
          language === "en"
            ? surahData?.arabicName || ""
            : surahData?.name || "";

        const isSurahPlaying = isPlaying && currentSurahNumber === surahNumber;

        return (
          <ReciterSurahCard
            key={surahId}
            name={mainSurahName}
            number={surahNumber}
            arabicName={secondSurahName}
            onPlay={() => onPlay(surahNumber)}
            isPlaying={isSurahPlaying}
            onDownload={() => onDownload(surahNumber)}
            onCopyLink={() => onCopyLink(surahNumber)}
          />
        );
      })}
    </div>
  );
};
