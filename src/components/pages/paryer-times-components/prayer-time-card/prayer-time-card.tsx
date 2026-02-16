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
        relative overflow-hidden rounded-xl p-4 md:p-6
        transition-all duration-300 hover:scale-105
        ${
          isNext
            ? "bg-primary/20 border-2 border-primary shadow-lg"
            : "bg-surface border border-border"
        }
      `}
    >
      {isNext && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-primary-dark text-white text-xs rounded-full">
          {t("prayer_times.next")}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
              p-2 rounded-lg
              ${isNext ? "bg-primary text-white" : "bg-primary/10 text-primary"}
            `}
          >
            {icon || <AccessTime fontSize="medium" />}
          </div>

          <div>
            <h3
              className={`
                text-base md:text-lg font-semibold
                ${isNext ? "text-primary" : "text-text-primary"}
              `}
            >
              {name}
            </h3>
          </div>
        </div>

        <div
          className={`
            text-xl md:text-2xl font-bold
            ${isNext ? "text-primary" : "text-text-primary"}
          `}
        >
          {time}
        </div>
      </div>
    </div>
  );
};
