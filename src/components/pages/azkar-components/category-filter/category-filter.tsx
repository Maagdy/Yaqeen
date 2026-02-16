import { useTranslation } from "react-i18next";
import type { CategoryFilterProps } from "./category-filter.types";
import type { DuaCategory } from "@/utils/doaaData";

const CATEGORIES: Array<DuaCategory | "all"> = [
  "all",
  "morning_evening",
  "prayer",
  "forgiveness",
  "anxiety",
  "protection",
  "gratitude",
  "knowledge",
  "family",
  "rizq",
  "daily",
  "sleep",
  "guidance",
  "hereafter",
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      {/* Desktop: Horizontal scrollable tabs */}
      <div className="hidden md:flex gap-2 overflow-x-auto pb-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary border border-border"
            }`}
          >
            {category === "all"
              ? t("azkar.all_categories")
              : t(`azkar.categories.${category}`)}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-surface text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category === "all"
                ? t("azkar.all_categories")
                : t(`azkar.categories.${category}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
