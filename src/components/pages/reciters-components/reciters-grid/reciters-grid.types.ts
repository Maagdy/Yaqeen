import type { Reciter } from "../../../../api/domains/reciters";

export interface RecitersGridProps {
  reciters: Reciter[];
  onReciterClick: (id: number) => void;
}
