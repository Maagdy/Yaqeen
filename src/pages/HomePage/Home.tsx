import { HomeWelcome } from "../../components/pages/home-components/home-welcome";
import HomeQuranTabs from "../../components/pages/home-components/home-quran-tabs";
import type { HomePageProps } from "./Home.types";

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <>
      <HomeWelcome />
      <HomeQuranTabs />
    </>
  );
};
