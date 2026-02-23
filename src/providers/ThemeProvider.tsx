import { useEffect, useMemo, useRef } from "react";
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

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);

  const themeColors = colors[theme];
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = usePreferencesStore((state) => state.theme);
  const setThemeStore = usePreferencesStore((state) => state.setTheme);

  const isFirstRender = useRef(true);

  useEffect(() => {
    // First render: apply immediately, no animation
    if (isFirstRender.current) {
      applyTheme(theme);
      isFirstRender.current = false;
      return;
    }

    // Theme toggle: use View Transitions API for a smooth crossfade
    if (document.startViewTransition) {
      document.startViewTransition(() => applyTheme(theme));
    } else {
      applyTheme(theme);
    }
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
