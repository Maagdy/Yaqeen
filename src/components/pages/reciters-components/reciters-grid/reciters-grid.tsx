import { useTranslation } from "react-i18next";

import { ReciterCard } from "../../../common";
import type { RecitersGridProps } from "./reciters-grid.types";

export const RecitersGrid: React.FC<RecitersGridProps> = ({
  reciters,
  onReciterClick,
}) => {
  const { t } = useTranslation();

  if (reciters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">
          {t("reciters.no_reciters")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {reciters.map((reciter) => (
        <ReciterCard
          key={reciter.id}
          reciter={reciter}
          onClick={() => onReciterClick(reciter.id)}
        />
      ))}
    </div>
  );
};
