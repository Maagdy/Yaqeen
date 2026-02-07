import type { TafsirSegment } from "@/api/domains/tafsir";

export interface TafsirCardProps {
  segment: TafsirSegment;
  isPlaying?: boolean;
  onToggle: () => void;
}
