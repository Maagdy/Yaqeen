import { useAllMushafs } from "@/api/domains/mushafs";
import { Loading } from "@/components/ui";
import { useTranslation } from "react-i18next";
import ErrorPage from "../ErrorPage/ErrorPage";
import { FullMushafCard } from "@/components/common";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "@/router/routes";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useLanguage } from "@/hooks";

function QuranPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: mushafs, isLoading, isError, error, refetch } = useAllMushafs();

  const seoConfig = SEO_CONFIG.quran[language as "en" | "ar"];

  if (isError) {
    return (
      <ErrorPage
        error={error}
        onRetry={refetch}
        showHomeButton
        showRetryButton
        title={t("quran.error_loading_page")}
      />
    );
  }

  if (isLoading) {
    return <Loading message={t("quran.loading")} size="lg" />;
  }

  const handleMushafNavigate = (mushafId: number) => {
    navigate(generateRoute.mushafDetails(mushafId));
  };
  return (
    <>
      <SEO {...seoConfig} />
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
          {t("quran.title", { defaultValue: "Quran Mushafs" })}
        </h1>
        <p className="text-muted-foreground">
          {t("quran.subtitle", {
            defaultValue: "Explore different Quran recitations and styles",
          })}
        </p>
      </div>

      {/* Mushafs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mushafs?.map((mushaf) => (
          <FullMushafCard
            key={mushaf.id}
            mushaf={mushaf}
            onClick={() => handleMushafNavigate(mushaf.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {mushafs && mushafs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t("quran.no_mushafs", { defaultValue: "No mushafs available" })}
          </p>
        </div>
      )}
      </div>
    </>
  );
}

export default QuranPage;
