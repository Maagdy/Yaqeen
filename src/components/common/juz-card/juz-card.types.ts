import type { Surah } from "../../../api/queries/queries.types";

export interface JuzCardProps {
  juzNumber: number;
  surahs: Surah[];
  onClick?: () => void;
}
