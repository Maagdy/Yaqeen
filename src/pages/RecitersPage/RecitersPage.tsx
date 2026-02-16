import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks";
import { useReciters } from "../../api";
import { useMemo, useState } from "react";
import {
  ReciterControls,
  ReciterResultsCount,
  RecitersGrid,
} from "../../components/pages";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Loading } from "../../components/ui";
import type { RecitersPageProps } from "./RecitersPage.types";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "../../router/routes";
import { SEO, SEO_CONFIG } from "@/components/seo";

const RecitersPage: React.FC<RecitersPageProps> = () => {
  const { language } = useLanguage();
  const { data: reciters, isLoading, error } = useReciters({ language });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const seoConfig = SEO_CONFIG.reciters[language as "en" | "ar"];

  const handleReciterClick = (reciterId: number) => {
    navigate(generateRoute.reciterDetails(reciterId));
  };

  const normalizeArabic = (text: string): string => {
    return text
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[ًٌٍَُِّْـ]/g, "");
  };

  const filteredAndSortedReciters = useMemo(() => {
    if (!reciters) return [];

    const normalizedQuery =
      language === "ar"
        ? normalizeArabic(searchQuery.toLowerCase())
        : searchQuery.toLowerCase();

    const filtered = reciters.filter((reciter) => {
      const normalizedName =
        language === "ar"
          ? normalizeArabic(reciter.name.toLowerCase())
          : reciter.name.toLowerCase();
      return normalizedName.includes(normalizedQuery);
    });

    filtered.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;

      const compareResult = nameA.localeCompare(
        nameB,
        language === "ar" ? "ar" : "en",
        {
          sensitivity: "base",
        },
      );

      return sortAscending ? compareResult : -compareResult;
    });

    return filtered;
  }, [reciters, searchQuery, sortAscending, language]);

  if (isLoading) {
    return <Loading size="lg" message={t("reciters.loading")} />;
  }

  if (error) {
    return <ErrorPage message={t("reciters.error_loading")} />;
  }

  if (!reciters || reciters.length === 0) {
    return <ErrorPage message={t("reciters.no_reciters")} />;
  }

  return (
    <>
      <SEO {...seoConfig} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ReciterControls
        totalCount={reciters.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        sortAscending={sortAscending}
        onSortToggle={() => setSortAscending(!sortAscending)}
      />

      <ReciterResultsCount count={filteredAndSortedReciters.length} />

      <RecitersGrid
        reciters={filteredAndSortedReciters}
        onReciterClick={handleReciterClick}
      />
      </div>
    </>
  );
};

export default RecitersPage;
