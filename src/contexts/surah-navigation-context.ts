import { createContext } from "react";
import type { SurahNavigationContextType } from "./surah-navigation-context.types";

export const SurahNavigationContext = createContext<
  SurahNavigationContextType | undefined
>(undefined);
