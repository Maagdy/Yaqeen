import { useTranslation } from "react-i18next";
import type { RecitersHeaderProps } from "./reciter-header.types";

export const RecitersHeader: React.FC<RecitersHeaderProps> = ({
  totalCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
        {t("reciters.title")}
      </h1>
      <p className="text-text-secondary text-sm">
        {t("reciters.browse", { count: totalCount })}
      </p>
    </div>
  );
};
