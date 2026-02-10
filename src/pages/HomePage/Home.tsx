import { useNavigate } from "react-router-dom";
import { generateRoute } from "../../router/routes";
import { HomeWelcome } from "../../components/pages";
import HomeQuranTabs from "../../components/pages/home-components/home-quran-tabs";
import HomeSearchBar from "../../components/pages/home-components/home-search-bar/home-search-bar";
import type { HomePageProps } from "./Home.types";
import { useTranslation } from "react-i18next";

export const HomePage: React.FC<HomePageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(generateRoute.search(keyword));
    }
  };

  return (
    <>
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
