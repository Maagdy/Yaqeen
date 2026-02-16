export type PlaybackType = 'surah' | 'ayah' | 'radio' | null;

export interface AudioContextType {
  isPlaying: boolean;
  currentAudio: string | null;
  currentSurahNumber: number | null;
  playbackType: PlaybackType;
  progress: number;
  duration: number;
  volume: number;

  play: (audioUrl: string, surahNumber?: number, type?: PlaybackType) => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}
