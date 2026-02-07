import { HomeWelcome } from "../../components/pages";
import HomeQuranTabs from "../../components/pages/home-components/home-quran-tabs";
import HomeSearchBar from "../../components/pages/home-components/home-search-bar/home-search-bar";
import type { HomePageProps } from "./Home.types";
import { useTranslation } from "react-i18next";

export const HomePage: React.FC<HomePageProps> = () => {
  const { t } = useTranslation();
  return (
    <>
      <HomeSearchBar
        onSearch={() => {}}
        onChange={() => {}}
        value={""}
        placeholder={t("home.search_placeholder")}
      />
      <HomeWelcome id="quran-tabs" />
      <HomeQuranTabs />
    </>
  );
};
