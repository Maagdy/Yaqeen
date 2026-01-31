import { useTranslation } from "react-i18next";
import { Search, Clear } from "@mui/icons-material";
import type { ReciterSearchBarProps } from "./reciter-search-bar.types";

export const ReciterSearchBar: React.FC<ReciterSearchBarProps> = ({
  value,
  onChange,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full sm:w-72">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="text-text-secondary" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("reciters.search_placeholder")}
        className="w-full pl-10 pr-10 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-3 flex items-center text-text-secondary hover:text-text-primary"
          aria-label={t("reciters.clear_search")}
        >
          <Clear />
        </button>
      )}
    </div>
  );
};
