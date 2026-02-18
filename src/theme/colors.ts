import type { Colors } from "../types";

export const colors: Colors = {
  light: {
    background: "#ffffff",
    surface: "#f5f5f5",
    textPrimary: "#212121",
    textSecondary: "#757575",
    primary: "#4caf50",
    border: "#e0e0e0",
    ramadan: "#4d4d4d",
  },
  dark: {
    background: "#1a1a1a",
    surface: "#1e1e1e",
    textPrimary: "#ffffff",
    textSecondary: "#b0b0b0",
    primary: "#4caf50",
    primaryLight: "#81c784",
    primaryDark: "#388e3c",
    primaryMuted: "#2e7d32",
    border: "#2c2c2c",
    ramadan: "transparent", // Ramadan color is only used as a background gradient stop in dark mode, so we set it to transparent and use opacity to achieve the desired effect
  },
};
