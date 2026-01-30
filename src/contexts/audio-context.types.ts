export interface AudioContextType {
  // State
  isPlaying: boolean;
  currentAudio: string | null;
  currentSurahNumber: number | null; // Changed from currentAyahNumber
  progress: number;
  duration: number;
  volume: number;

  // Actions
  play: (audioUrl: string, surahNumber?: number) => void; // Changed parameter name
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}
