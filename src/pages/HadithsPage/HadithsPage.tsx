import { useHadithCollections } from "@/api/domains/tafsir";
import { HadithCollectionCard } from "@/components/pages";
import { Loading } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "@/router/routes";
import { useTranslation } from "react-i18next";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useLanguage } from "@/hooks";

import { ErrorPage } from "@/pages/ErrorPage";

function HadithsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const {
    data: collections,
    isLoading,
    isError,
    error,
    refetch,
  } = useHadithCollections();
  const navigate = useNavigate();

  const seoConfig = SEO_CONFIG.hadiths[language as "en" | "ar"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loading message={t("hadith.loading")} size="lg" />
      </div>
    );
  }

  if (isError) {
    console.error("Error loading hadith collections:", error);
    return (
      <ErrorPage
        title={t("hadith.error_loading")}
        message={t("hadith.error_loading_page")}
        showRetryButton
        onRetry={() => refetch()}
        showHomeButton
      />
    );
  }

  return (
    <>
      <SEO {...seoConfig} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70 mb-8 text-center">
        {t("hadith.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections?.map((collection, index) => (
          <HadithCollectionCard
            key={index}
            collection={collection}
            onClick={() =>
              navigate(generateRoute.hadithDetails(collection.name))
            }
          />
        ))}
      </div>
      </div>
    </>
  );
}

export default HadithsPage;
