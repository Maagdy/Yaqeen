import { useNavigate } from "react-router-dom";
import { generateRoute } from "../../router/routes";
import { HomeWelcome } from "../../components/pages";
import HomeQuranTabs from "../../components/pages/home-components/home-quran-tabs";
import HomeSearchBar from "../../components/pages/home-components/home-search-bar/home-search-bar";
import type { HomePageProps } from "./Home.types";
import { useTranslation } from "react-i18next";
import { SEO, SEO_CONFIG, getWebsiteStructuredData, getOrganizationStructuredData } from "@/components/seo";
import { useLanguage } from "@/hooks";

export const HomePage: React.FC<HomePageProps> = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(generateRoute.search(keyword));
    }
  };

  const seoConfig = SEO_CONFIG.home[language as "en" | "ar"];
  const structuredData = [
    getWebsiteStructuredData(language),
    getOrganizationStructuredData(),
  ];

  return (
    <>
      <SEO {...seoConfig} structuredData={structuredData} />
      <HomeSearchBar
        onSearch={handleSearch}
        onChange={() => {}} // We can let the component handle local state or lift it up if needed. For now simpler.
        value={undefined} // Let component handle uncontrolled or pass undefined
        placeholder={t("home.search_placeholder")}
      />
      <HomeWelcome id="quran-tabs" />
      <HomeQuranTabs />
    </>
  );
};
