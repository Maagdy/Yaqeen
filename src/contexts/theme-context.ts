import { createContext } from "react";
import type { ThemeContextType } from "./theme-context.types";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
