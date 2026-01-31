import { useTranslation } from "react-i18next";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import type { ReciterSortButtonProps } from "./reciter-sort-button.types";

export const ReciterSortButton: React.FC<ReciterSortButtonProps> = ({
  sortAscending,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-lg text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap"
      aria-label={sortAscending ? t("reciters.sort_za") : t("reciters.sort_az")}
    >
      {sortAscending ? <ArrowUpward /> : <ArrowDownward />}
      <span>
        {sortAscending ? t("reciters.sort_az") : t("reciters.sort_za")}
      </span>
    </button>
  );
};
