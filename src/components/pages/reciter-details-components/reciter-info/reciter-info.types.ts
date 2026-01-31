import type { Reciter } from "../../../../api/domains/reciters/reciters.types";

export interface ReciterInfoProps {
  reciter: Reciter;
  selectedMoshafIndex: number;
  onMoshafSelect: (index: number) => void;
}
