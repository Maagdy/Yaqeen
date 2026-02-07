import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/useLanguage";

interface RadioResultsCountProps {
  count: number;
}

export function RadioResultsCount({ count }: RadioResultsCountProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const formattedCount = new Intl.NumberFormat(
    language === "ar" ? "ar-EG" : "en-US",
  ).format(count);

  return (
    <div className="mb-4">
      <p className="text-text-secondary text-sm">
        {t("radio.showing_count", {
          formattedCount,
        })}
      </p>
    </div>
  );
}
