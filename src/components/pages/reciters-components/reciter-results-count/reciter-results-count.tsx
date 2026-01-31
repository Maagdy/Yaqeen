import { useTranslation } from "react-i18next";
import type { ReciterResultsCountProps } from "./reciter-results-count.types";

export const ReciterResultsCount: React.FC<ReciterResultsCountProps> = ({
  count,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <p className="text-text-secondary text-sm">
        {t("reciters.showing_count", { count })}
      </p>
    </div>
  );
};
