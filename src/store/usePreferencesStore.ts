import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Language, AudioSettings } from '../types';

interface PreferencesState {
  theme: Theme;
  language: Language;
  audioSettings: AudioSettings;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      audioSettings: {
        volume: 1,
        autoplay: false,
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setAudioSettings: (settings) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings },
        })),
    }),
    {
      name: 'sabeel-preferences',
    }
  )
);
