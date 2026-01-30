import { useContext } from "react";
import { SurahNavigationContext } from "../contexts/surah-navigation-context";

export const useSurahNavigation = () => {
  const context = useContext(SurahNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useSurahNavigation must be used within a SurahNavigationProvider",
    );
  }
  return context;
};
