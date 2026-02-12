import type { Ayah } from "@/api";

export interface DesktopAyahsListProps {
  ayahs: Ayah[];
  isRtl: boolean;
  language: string;
  isMobile: boolean;
  isPlaying: boolean;
  currentSurahNumber: number | null;
  currentAudio: string | null;
  hoveredAyah: number | null;
  onAyahHover: (ayahNumber: number | null) => void;
  onAyahClick: (ayah: Ayah) => void;
  onDetailsClick?: (ayah: Ayah) => void;
}
