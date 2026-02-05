import { createTheme } from "@mui/material/styles";
import type { ColorScheme } from "../types";

export const createMuiTheme = (scheme: ColorScheme, mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: scheme.primary,
        light: scheme.primaryLight || scheme.primary,
        dark: scheme.primaryDark || scheme.primary,
      },
      background: {
        default: scheme.background,
        paper: scheme.surface,
      },
      text: {
        primary: scheme.textPrimary,
        secondary: scheme.textSecondary,
      },
      divider: scheme.border,
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "8px",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "16px",
          },
        },
      },
    },
  });
};
