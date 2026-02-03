import type { Ayah, Surah } from "../../../../api";

export interface AyahModalProps {
  open: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surah: Surah;
}
