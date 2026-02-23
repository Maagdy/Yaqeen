import { useTranslation } from "react-i18next";

import type { PrayerTimeCardProps } from "./prayer-time-card.types";
import { AccessTime } from "@mui/icons-material";

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  name,
  time,
  icon,
  isNext = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6
        transition-all duration-300 hover:scale-105
        ${
          isNext
            ? "bg-primary/20 border-2 border-primary shadow-lg"
            : "bg-surface border border-border"
        }
      `}
    >
      {isNext && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-dark text-white text-[10px] sm:text-xs rounded-full">
          {t("prayer_times.next")}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`
              p-1.5 sm:p-2 rounded-lg
              ${isNext ? "bg-primary text-white" : "bg-primary/10 text-primary"}
            `}
          >
            {icon || <AccessTime fontSize="small" />}
          </div>

          <h3
            className={`
              text-sm sm:text-base md:text-lg font-semibold
              ${isNext ? "text-primary" : "text-text-primary"}
            `}
          >
            {name}
          </h3>
        </div>

        <div
          className={`
            text-base sm:text-xl md:text-2xl font-bold text-center sm:text-right
            ${isNext ? "text-primary" : "text-text-primary"}
          `}
        >
          {time}
        </div>
      </div>
    </div>
  );
};
