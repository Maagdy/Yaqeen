import { useTranslation } from "react-i18next";
import type { ReciterResultsCountProps } from "./reciter-results-count.types";
import { useLanguage } from "../../../../hooks";
import { formatNumber } from "../../../../utils/numbers";

export const ReciterResultsCount: React.FC<ReciterResultsCountProps> = ({
  count,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <div className="mb-4">
      <p className="text-text-secondary text-sm">
        {t("reciters.showing_count", {
          formattedCount: formatNumber(count, language),
        })}
      </p>
    </div>
  );
};
