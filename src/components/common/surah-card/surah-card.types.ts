import type { Surah } from "../../../api/queries/queries.types";

export interface SurahCardProps {
  chapter: Surah;
  activeTab?: string;
  onClick?: () => void;
}
