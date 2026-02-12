import { useTranslation } from "react-i18next";
import {
  PlayCircleFilledRounded,
  PauseCircleFilledRounded,
  BookmarkAdd,
  Share,
} from "@mui/icons-material";
import { IconButton } from "../../../../../common/icon-button/icon-button";
import { formatNumber } from "@/utils/numbers";
import type { SurahHeaderProps } from "./SurahHeader.types";

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  isRtl,
  language,
  fullSurahAudioUrl,
  isFullSurahPlaying,
  onFullSurahClick,
}) => {
  const { t } = useTranslation();

  return (
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
            {"name" in surah ? (isRtl ? surah.name : surah.englishName) : ""}
          </h2>
          <p className="text-sm text-text-secondary">
            {"revelationType" in surah &&
              t(
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
            onClick={onFullSurahClick}
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
  );
};
