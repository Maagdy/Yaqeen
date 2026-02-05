import type { FullMushaf } from "@/api/domains/mushafs";

export interface FullMushafCardProps {
  mushaf: FullMushaf;
  onClick?: () => void;
}
