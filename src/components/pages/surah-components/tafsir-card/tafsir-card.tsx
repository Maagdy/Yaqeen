import React from "react";
import { PlayArrow, Pause } from "@mui/icons-material";
import type { TafsirCardProps } from "./tafsir-card.types";
import { useTranslation } from "react-i18next";

export const TafsirCard: React.FC<TafsirCardProps> = ({
  segment,
  isPlaying = false,
  onToggle,
}) => {
  const { t } = useTranslation();
  return (
    <div className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={onToggle}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 text-white transition-colors shadow-md shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause fontSize="medium" />
          ) : (
            <PlayArrow fontSize="medium" />
          )}
        </button>

        {/* Segment Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">
            {segment.name}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {t("common.surah")} {segment.sura_id}
          </p>
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="flex gap-1 items-end h-6">
            <div className="w-1 bg-primary rounded-full animate-pulse h-3" />
            <div className="w-1 bg-primary rounded-full animate-pulse h-4 animation-delay-150" />
            <div className="w-1 bg-primary rounded-full animate-pulse h-5 animation-delay-300" />
          </div>
        )}
      </div>
    </div>
  );
};
