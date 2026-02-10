import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../hooks";
import { formatNumber } from "../../../../utils/numbers";
import type { NextSurahCardProps } from "./next-surah-card-props";
import { IconButton } from "../../../common";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export const NextSurahCard = ({
  chapter,
  onClick,
  isPrevious = false,
}: NextSurahCardProps) => {
  const { t } = useTranslation();
  const { language, isRtl } = useLanguage();
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center justify-between p-4 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md cursor-pointer h-24"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base sm:text-lg group-hover:text-primary transition-colors duration-300 truncate">
            {isRtl ? chapter.arabicName : chapter.name}
          </h3>
          <span
            className={`text-text-secondary text-xs sm:text-sm font-bold ${isRtl ? "font-amiri" : ""}`}
          >
            {formatNumber(chapter.verses, language)} {t("home.verses")}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right shrink-0">
        <IconButton
          onClick={onClick}
          variant="default"
          size="md"
          icon={
            isRtl ? (
              <ArrowBackIcon fontSize="small" />
            ) : (
              <ArrowForwardIcon fontSize="small" />
            )
          }
          label={isPrevious ? t("surah.previous") : t("surah.next")}
          iconPosition="right"
        />
      </div>
    </div>
  );
};
