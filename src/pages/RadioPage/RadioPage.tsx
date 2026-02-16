import { useRadios } from "@/api/domains/radio";
import {
  RadioCard,
  RadioControls,
  RadioResultsCount,
} from "@/components/pages";
import { Loading } from "@/components/ui";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks";
import { SEO, SEO_CONFIG } from "@/components/seo";

function RadioPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: radios, isLoading, isError, refetch } = useRadios(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(false);

  const seoConfig = SEO_CONFIG.radio[language as "en" | "ar"];

  const filteredAndSortedRadios = useMemo(() => {
    if (!radios) return [];

    const result = radios.filter((radio) =>
      radio.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    result.sort((a, b) => {
      const dateA = new Date(a.recent_date).getTime();
      const dateB = new Date(b.recent_date).getTime();
      return sortAscending ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [radios, searchQuery, sortAscending]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" message={t("radio.loading")} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorPage
        message={t("radio.error")}
        showRetryButton
        onRetry={() => refetch()}
        showHomeButton
      />
    );
  }

  return (
    <>
      <SEO {...seoConfig} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <RadioControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortAscending={sortAscending}
        onSortToggle={() => setSortAscending(!sortAscending)}
        count={radios?.length || 0}
      />

      <RadioResultsCount count={filteredAndSortedRadios.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedRadios.map((radio) => (
          <RadioCard key={radio.id} radio={radio} />
        ))}
      </div>
      </div>
    </>
  );
}

export default RadioPage;
