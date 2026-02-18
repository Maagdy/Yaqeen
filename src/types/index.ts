export type Theme = "light" | "dark";
export type Language = "en" | "ar";

export interface AudioSettings {
  volume: number;
  autoplay: boolean;
}

export interface ColorScheme {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryLight?: string;
  primaryDark?: string;
  primaryMuted?: string;
  border: string;
  ramadan: string;
}

export interface Colors {
  light: ColorScheme;
  dark: ColorScheme;
}
