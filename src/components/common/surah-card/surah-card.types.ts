import type { Surah } from "@/api";

export interface SurahCardProps {
  chapter: Surah;
  activeTab?: string;
  onClick?: () => void;
}
