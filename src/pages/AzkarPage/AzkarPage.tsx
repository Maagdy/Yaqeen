import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useLanguage } from "@/hooks";
import { DUAS, type DuaCategory } from "@/utils/doaaData";
import {
  CategoryFilter,
  DuaCard,
} from "@/components/pages/azkar-components";

const AzkarPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRtl } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const seoConfig = SEO_CONFIG.azkar[language as "en" | "ar"];

  // Filter duas by category
  const filteredDuas = useMemo(() => {
    if (selectedCategory === "all") {
      return DUAS;
    }
    return DUAS.filter((dua) => dua.category === selectedCategory);
  }, [selectedCategory]);

  // Group duas by category for "all" view
  const groupedDuas = useMemo(() => {
    if (selectedCategory !== "all") return null;

    const groups: Partial<Record<DuaCategory, Array<(typeof DUAS)[number]>>> =
      {};

    DUAS.forEach((dua) => {
      if (!groups[dua.category]) {
        groups[dua.category] = [];
      }
      groups[dua.category]?.push(dua);
    });

    return groups;
  }, [selectedCategory]);

  return (
    <>
      <SEO {...seoConfig} />
      <Helmet>
        <html lang={language} dir={isRtl ? "rtl" : "ltr"} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            {t("azkar.title")}
          </h1>
          <p className="text-lg text-text-secondary">
            {t("azkar.subtitle")}
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Stats */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("azkar.showing_count", { count: filteredDuas.length })}
          </p>
        </div>

        {/* Duas Grid */}
        {selectedCategory === "all" && groupedDuas ? (
          // Show grouped by category
          <div className="space-y-12">
            {Object.entries(groupedDuas).map(([category, duas]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-text-primary mb-6 pb-2 border-b border-border">
                  {t(`azkar.categories.${category}` as any)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {duas?.map((dua) => (
                    <DuaCard
                      key={dua.id}
                      dua={dua}
                      isRtl={isRtl}
                      showCategoryBadge={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show flat list for specific category
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredDuas.map((dua) => (
              <DuaCard
                key={dua.id}
                dua={dua}
                isRtl={isRtl}
                showCategoryBadge={false}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {t("azkar.no_duas")}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AzkarPage;
