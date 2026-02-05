import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { colors } from "../theme/colors";
import { usePreferencesStore } from "../store/usePreferencesStore";
import type { Theme } from "../types";
import { ThemeContext } from "../contexts/theme-context";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createMuiTheme } from "../theme/mui-theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = usePreferencesStore((state) => state.theme);
  const setThemeStore = usePreferencesStore((state) => state.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    const themeColors = colors[theme];
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeStore(newTheme);
  };

  const toggleTheme = () => {
    setThemeStore(theme === "light" ? "dark" : "light");
  };

  const muiTheme = useMemo(() => createMuiTheme(colors[theme], theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
