import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Radio,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

interface RadioControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortAscending: boolean;
  onSortToggle: () => void;
  count: number;
}

export function RadioControls({
  searchQuery,
  onSearchChange,
  sortAscending,
  onSortToggle,
  count,
}: RadioControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Left: Title & Meta */}
      <div className="flex items-center gap-4">
        <div className="p-3  rounded-xl hidden sm:flex">
          <Radio className="w-8 h-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            {t("radio.title")}
          </h1>
          <p className="text-text-secondary text-sm">
            {t("radio.browse", { count })}
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 lg:w-75">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
            placeholder={t("radio.search_placeholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Button */}
        <button
          onClick={onSortToggle}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg bg-card hover:bg-acceleration hover:border-primary/30 transition-all min-w-35",
            "text-sm font-medium text-foreground",
          )}
        >
          <Calendar className="h-4 w-4 text-primary" />
          <span>{t("common.date")}</span>
          {sortAscending ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
