import { createContext } from "react";
import type { AudioContextType } from "./audio-context.types";

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined,
);
