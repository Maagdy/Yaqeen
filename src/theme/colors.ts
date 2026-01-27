import type { Colors } from "../types";

export const colors: Colors = {
  light: {
    background: "#ffffff", // White - Main page background
    surface: "#f5f5f5", // Light gray - Cards, header, footer surfaces
    textPrimary: "#212121", // Near black - Primary text
    textSecondary: "#757575", // Medium gray - Secondary text
    primary: "#4caf50", // Green - Buttons, links, accents
    border: "#e0e0e0", // Light gray - Borders
  },
  dark: {
    background: "#1a1a1a", // Dark gray - Main page background (lighter than before)
    surface: "#1e1e1e", // Dark gray - Cards, header, footer surfaces
    textPrimary: "#ffffff", // White - Primary text
    textSecondary: "#b0b0b0", // Light gray - Secondary text
    primary: "#4caf50", // Green - Buttons, links, accents (consistent)
    primaryLight: "#81c784", // Light green - Hover states, highlights
    primaryDark: "#388e3c", // Dark green - Pressed states, borders
    primaryMuted: "#2e7d32", // Muted green - Subtle accents
    border: "#2c2c2c", // Medium dark gray - Borders
  },
};
